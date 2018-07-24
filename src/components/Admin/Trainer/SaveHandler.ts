import {
	basename,
	concatenateArrayBuffers,
	getModelArtifactsInfoForJSON
} from '@tensorflow/tfjs-core/dist/io/io_utils';
import {
	IORouter,
	IORouterRegistry
} from '@tensorflow/tfjs-core/dist/io/router_registry';
import {
	IOHandler,
	ModelArtifacts,
	SaveResult,
	WeightsManifestConfig,
	WeightsManifestEntry
} from '@tensorflow/tfjs-core/dist/io/io';
import initFirebase from '../../../utils/firebase';
import * as firebase from 'firebase/app';
import 'firebase/storage';

const DEFAULT_FILE_NAME_PREFIX = 'model';
const DEFAULT_JSON_EXTENSION_NAME = '.json';
const DEFAULT_WEIGHT_DATA_EXTENSION_NAME = '.weights.bin';

export class FirebaseUploads implements IOHandler {
	private readonly modelTopologyFileName: string;
	private readonly weightDataFileName: string;

	static readonly URL_SCHEME = 'firebase://';

	constructor(fileNamePrefix?: string) {
		if (fileNamePrefix.startsWith(FirebaseUploads.URL_SCHEME)) {
			fileNamePrefix = fileNamePrefix.slice(
				FirebaseUploads.URL_SCHEME.length
			);
		}
		if (fileNamePrefix == null || fileNamePrefix.length === 0) {
			fileNamePrefix = DEFAULT_FILE_NAME_PREFIX;
		}

		this.modelTopologyFileName =
			fileNamePrefix + DEFAULT_JSON_EXTENSION_NAME;
		this.weightDataFileName =
			fileNamePrefix + DEFAULT_WEIGHT_DATA_EXTENSION_NAME;
	}

	async save(modelArtifacts: ModelArtifacts): Promise<SaveResult> {
		const weightsBlob = new Blob([modelArtifacts.weightData], {
				type: 'application/octet-stream'
			}
		);

		if (modelArtifacts.modelTopology instanceof ArrayBuffer) {
			throw new Error(
				'DownloadTrigger.save() does not support saving model topology ' +
					'in binary formats yet.'
			);
		} else {
			const weightsManifest: WeightsManifestConfig = [
				{
					paths: ['./' + this.weightDataFileName],
					weights: modelArtifacts.weightSpecs
				}
			];
			const modelTopologyAndWeightManifest = {
				modelTopology: modelArtifacts.modelTopology,
				weightsManifest
			};
			const modelTopologyAndWeightManifestBlob = new Blob(
				[JSON.stringify(modelTopologyAndWeightManifest)],
				{type: 'application/json'}
			);

			initFirebase();
            const store = firebase.storage();
            
            await store.ref().child('models/' + this.modelTopologyFileName).put(modelTopologyAndWeightManifestBlob);
            if (modelArtifacts.weightData != null) {
                await store.ref().child('models/' + this.weightDataFileName).put(weightsBlob);
            }

			return {
				modelArtifactsInfo: getModelArtifactsInfoForJSON(modelArtifacts)
			};
		}
	}

/*	async load(): Promise<ModelArtifacts> {
		// TODO: Implement
		const jsonFile = null;
		const weightFiles = null;

		return new Promise<ModelArtifacts>((resolve, reject) => {
			const jsonReader = new FileReader();
			jsonReader.onload = (event: Event) => {
				const modelJSON = JSON.parse((event.target as any).result);
				const modelTopology = modelJSON.modelTopology as {};
				if (modelTopology == null) {
					reject(
						new Error(
							`modelTopology field is missing from file ${
								jsonFile.name
							}`
						)
					);
					return;
				}

				if (weightFiles.length === 0) {
					resolve({modelTopology});
				}

				const weightsManifest = modelJSON.weightsManifest as WeightsManifestConfig;
				if (weightsManifest == null) {
					reject(
						new Error(
							`weightManifest field is missing from file ${
								jsonFile.name
							}`
						)
					);
					return;
				}

				let pathToFile: {[path: string]: File};
				try {
					pathToFile = this.checkManifestAndWeightFiles(
						weightsManifest,
						weightFiles
					);
				} catch (err) {
					reject(err);
					return;
				}

				const weightSpecs: WeightsManifestEntry[] = [];
				const paths: string[] = [];
				const perFileBuffers: ArrayBuffer[] = [];
				weightsManifest.forEach(weightsGroup => {
					weightsGroup.paths.forEach(path => {
						paths.push(path);
						perFileBuffers.push(null);
					});
					weightSpecs.push(...weightsGroup.weights);
				});

				weightsManifest.forEach(weightsGroup => {
					weightsGroup.paths.forEach(path => {
						const weightFileReader = new FileReader();
						weightFileReader.onload = (event: Event) => {
							const weightData = (event.target as any)
								.result as ArrayBuffer;
							const index = paths.indexOf(path);
							perFileBuffers[index] = weightData;
							if (perFileBuffers.indexOf(null) === -1) {
								resolve({
									modelTopology,
									weightSpecs,
									weightData: concatenateArrayBuffers(
										perFileBuffers
									)
								});
							}
						};
						weightFileReader.onerror = (
							error: FileReaderProgressEvent
						) => {
							reject(
								`Failed to weights data from file of path '${path}'.`
							);
							return;
						};
						weightFileReader.readAsArrayBuffer(pathToFile[path]);
					});
				});
			};
			jsonReader.onerror = (error: FileReaderProgressEvent) => {
				reject(
					`Failed to read model topology and weights manifest JSON ` +
						`from file '${
							jsonFile.name
						}'. FirebaseStorage supports loading ` +
						`Keras-style tf.Model artifacts only.`
				);
				return;
			};
			jsonReader.readAsText(jsonFile);
		});
	}

	/**
	 * Check the compatibility between weights manifest and weight files.
	 */
	private checkManifestAndWeightFiles(
		manifest: WeightsManifestConfig,
		files: File[]
	): {[path: string]: File} {
		const basenames: string[] = [];
		const fileNames = files.map(file => basename(file.name));
		const pathToFile: {[path: string]: File} = {};
		for (const group of manifest) {
			group.paths.forEach(path => {
				const pathBasename = basename(path);
				if (basenames.indexOf(pathBasename) !== -1) {
					throw new Error(
						`Duplicate file basename found in weights manifest: ` +
							`'${pathBasename}'`
					);
				}
				basenames.push(pathBasename);
				if (fileNames.indexOf(pathBasename) === -1) {
					throw new Error(
						`Weight file with basename '${pathBasename}' is not provided.`
					);
				} else {
					pathToFile[path] = files[fileNames.indexOf(pathBasename)];
				}
			});
		}

		if (basenames.length !== files.length) {
			throw new Error(
				`Mismatch in the number of files in weights manifest ` +
					`(${
						basenames.length
					}) and the number of weight files provided ` +
					`(${files.length}).`
			);
		}
		return pathToFile;
	}
}

export const firebaseUploadsRouter: IORouter = (url: string) => {
	if (url.startsWith(FirebaseUploads.URL_SCHEME)) {
		return firebaseUploads(url.slice(FirebaseUploads.URL_SCHEME.length));
	} else {
		return null;
	}
};

IORouterRegistry.registerSaveRouter(firebaseUploadsRouter);
IORouterRegistry.registerLoadRouter(firebaseUploadsRouter);

export function firebaseUploads(fileNamePrefix = 'model'): IOHandler {
	return new FirebaseUploads(fileNamePrefix);
}