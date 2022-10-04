import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // filter image endpoint
  app.get("/filteredimage", async (req, res) => {
    try{
    let filesArr: string[] = [];

    let image_url = req.query.image_url;
    
    if (!image_url ) {
      return res.status(400).send("url is required !!!");
    }

    //Check if url is valid
    const isValideUrl = isValidURL(image_url);

    if (!isValideUrl) {
      return res.status(400).send("url is not valid !!!");
    }

    const filteredImg = await filterImageFromURL(image_url);

    if (filteredImg === undefined || filteredImg === null) {
      return res.status(422).send(`Unable to filter image`);
    } else {
      filesArr.push(filteredImg);
      return res.status(200).sendFile(filteredImg, () => {
        deleteLocalFiles(filesArr);      
      });
    }
  } catch {
    return res.status(500).send({error: 'Unable to process your request'});
  }
  });

  function isValidURL(url : string) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
      '(\\#[-a-z\\d_]*)?$','i'); 
    return !!urlPattern.test(url);
  }

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();