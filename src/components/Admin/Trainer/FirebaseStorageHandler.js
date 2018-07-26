import initFirebase from '../../../utils/firebase';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import _ from 'lodash';

const DEFAULT_FILE_NAME_PREFIX = 'model';
const DEFAULT_JSON_EXTENSION_NAME = '.json';
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';

export default class FirebaseStorage {
  URL_SCHEME = 'firebase://';

  constructor(fileNamePrefix, classes) {
    if (fileNamePrefix.startsWith(FirebaseStorage.URL_SCHEME)) {
      fileNamePrefix = fileNamePrefix.slice(FirebaseStorage.URL_SCHEME.length);
    }
    if (fileNamePrefix == null || fileNamePrefix.length === 0) {
      fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
    }

    this.modelTopologyFileName = fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
    this.weightDataFileName =
      fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
    this.modelName = fileNamePrefix;
    this.classes = classes;
  }

  async save(modelArtifacts) {
    const weightsBlob = new Blob([modelArtifacts.weightData], {
      type: 'application/octet-stream'
    });

    if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
      throw new Error(
        'DownloadTrigger.save() does not support saving model topology ' +
          'in binary formats yet.'
      );
    } else {
      const weightsManifest = [
        {
          paths: ['./' + this.weightDataFileName],
          weights: modelArtifacts.weightSpecs
        }
      ];
      const modelTopologyAndWeightManifest = {
        modelTopology: modelArtifacts.modelTopology,
        weightsManifest,
        classes: this.classes
      };
      const modelTopologyAndWeightManifestBlob = new Blob(
        [JSON.stringify(modelTopologyAndWeightManifest)],
        {type: 'application/json'}
      );

      initFirebase();
      const store = firebase.storage();

      await store
        .ref()
        .child('models/' + this.modelTopologyFileName)
        .put(modelTopologyAndWeightManifestBlob);

      if (modelArtifacts.weightData != null) {
        await store
          .ref()
          .child('models/' + this.weightDataFileName)
          .put(weightsBlob);
      }

      const modelRef = firebase
        .firestore()
        .collection('models')
        .doc(this.modelName);

      const modelRow = await modelRef.get();
      if (!modelRow.exists) {
        modelRef.set({deployed: false, timestamp: Date.now()});
      }

      return {
        modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts)
      };
    }
  }

  async load() {
    initFirebase();
    const store = firebase.storage();
    this.path = await store
      .ref()
      .child('models/' + this.modelTopologyFileName)
      .getDownloadURL();

    const modelConfigRequest = await fetch(this.path);
    const modelConfig = await modelConfigRequest.json();
    const modelTopology = modelConfig['modelTopology'];
    const weightsManifest = modelConfig['weightsManifest'];
    const classes = modelConfig['classes'];

    // We do not allow both modelTopology and weightsManifest to be missing.
    if (modelTopology == null && weightsManifest == null) {
      throw new Error(
        `The JSON from HTTP path ${this.path} contains neither model ` +
          `topology or manifest for weights.`
      );
    }

    let weightSpecs;
    let weightData;
    if (weightsManifest != null) {
      weightSpecs = _.flatMap(
        modelConfig.weightsManifest,
        entry => entry.weights
      );

      const fetchURLs = [
        await store
          .ref()
          .child('models/' + this.weightDataFileName)
          .getDownloadURL()
      ];
      weightData = concatenateArrayBuffers(
        await loadWeightsAsArrayBuffer(fetchURLs)
      );
    }

    this.classes(classes);

    return {modelTopology, weightSpecs, weightData, classes};
  }
}

function getModelArtifactsInfoForJSON(modelArtifacts) {
  if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
    throw new Error('Expected JSON model topology, received ArrayBuffer.');
  }
  return {
    dateSaved: new Date(),
    modelTopologyType: 'JSON',
    modelTopologyBytes:
      modelArtifacts.modelTopology == null
        ? 0
        : stringByteLength(JSON.stringify(modelArtifacts.modelTopology)),
    weightSpecsBytes:
      modelArtifacts.weightSpecs == null
        ? 0
        : stringByteLength(JSON.stringify(modelArtifacts.weightSpecs)),
    weightDataBytes:
      modelArtifacts.weightData == null
        ? 0
        : modelArtifacts.weightData.byteLength
  };
}

function concatenateArrayBuffers(buffers) {
  let totalByteLength = 0;
  buffers.forEach(function(buffer) {
    totalByteLength += buffer.byteLength;
  });
  const temp = new Uint8Array(totalByteLength);
  let offset = 0;
  buffers.forEach(function(buffer) {
    temp.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  });
  return temp.buffer;
}

async function loadWeightsAsArrayBuffer(fetchURLs) {
  const requests = fetchURLs.map(fetchURL => get(fetchURL));
  const responses = await Promise.all(requests);
  return responses;
}

function stringByteLength(str) {
  return new Blob([str]).size;
}

// Body.arrayBuffer() not working when using fetch.
// XMLHttpRequest with arraybuffer response type works instead
function get(url) {
  return new Promise(accept => {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.addEventListener('load', () => {
      accept(req.response);
    });
    req.send();
  });
}
