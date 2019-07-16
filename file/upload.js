var fs = require("fs");
var PdfReader = require("pdfreader").PdfReader;
var passToReader = require('../utils/passfileReader')


  export const uploadFilesHandler = async (req, res) => {
    var form = new formidable.IncomingForm();
    var converttotextjson="";
 
    form.parse(req, function (err, fields, files) {
        var uploadname=files.file.name;
        var fileParams={
            Path:files.file.path,
            Name:files.file.name
        }

        fs.readFile(files.file.path, (err, data) => {
            passToReader.printMsg("Reader module is loaded successfully");      
            let pdfFilePath = files.file.path;
            let pdfBuffer =data;
            let filename =files.file.name;
            var fileextension = passToReader.getFileExtension(filename);
            console.log("File extension is -->" + fileextension);
            if(fileextension =='.pdf')
            {           
                new PdfReader().parseBuffer(pdfBuffer, function(err, item) {
                      if (err)  console.log(err);
                       else if (!item)  console.log(item);
                      else if (item.text) { converttotextjson =converttotextjson+item.text;               
                      }
                      });
            }
            else if(fileextension =='.txt' || fileextension =='.csv'){
                converttotextjson =data;
            }

            else if(fileextension =='.doc' || fileextension =='.docx' || fileextension =='.xlsx')

            {
               passToReader.extract(pdfFilePath).then(function(res, err) {
                if (err) {
                    console.log(err)
                }
                console.log(res);
                converttotextjson =res;
            })

            }

        });
    });
    //do all database record saving activity
};

