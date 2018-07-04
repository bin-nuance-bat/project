
async function getStore(callBack) {

    fetch("https://honesty.store/api/v1/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({storeCode: "sl-ncl"}), 
    }).then( (res) => res.json() )
      .then((res) => (callBack(res)));

}

export default getStore