async function main(params) {
    //fusionstrings/excalidraw-importmap-example/master
    const res = await fetch('https://api.jspm.io/generate', {method: 'POST', body: JSON.stringify({
        //"install": 'https://cdn.jsdelivr.net/gh/fusionstrings/excalidraw-importmap-example@1897767276489255191f67c67898fd7b8a30f388/js/main.js', 
        'install': 'react',
        "env": [ "browser", "module" ],
      })})
      const json = await res.json();
      console.log(json)

}
main();