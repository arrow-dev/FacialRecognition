using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using Newtonsoft.Json;

namespace processImages
{
    class Program
    {
        static void Main(string[] args)
        {
            var filePath = @"C:\Users\4rrowDev\Source\Repos\Web\MSAWEBAPP\app\images\celebImgUrls.txt";
            var urlList = File.ReadAllLines(filePath);
            var count = 0;
            foreach (var u in urlList)
            {
                var name = u.Split('|').First();
                var url = u.Split('|').Last();
                var imgFolderPath = @"C:\Users\4rrowDev\Source\Repos\Web\MSAWEBAPP\app\images\";
                var fileName = name + ".jpg";
                using (var client = new WebClient())
                {
                    client.DownloadFile(url, imgFolderPath+fileName);
                }
                AddFaceToList("master", name, url, fileName, count);
                System.Threading.Thread.Sleep(3000);
                count++;
            }
            Console.ReadLine();

        }

        static async void AddFaceToList(string listId, string name, string url, string fileName, int count)
        {
            var client = new HttpClient();
            var queryString = HttpUtility.ParseQueryString(string.Empty);

            // Request headers
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "9da3ade20681481bb489a91e206a37c9");

            // Request parameters
            queryString["faceListId"] = listId;
            queryString["userData"] = JsonConvert.SerializeObject(new {name = name, url = "/images/"+fileName});
            //queryString["targetFace"] = "{string}";
            var uri = "https://api.projectoxford.ai/face/v1.0/facelists/{faceListId}/persistedFaces?" + queryString;

            HttpResponseMessage response;

            // Request body
            byte[] byteData =
                Encoding.UTF8.GetBytes(
                    "{ \"url\": \""+ url +"\" }");

            using (var content = new ByteArrayContent(byteData))
            {
                content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
                response = await client.PostAsync(uri, content);
            }
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine(count + " Success");
            }
            else
            {
                Console.WriteLine(count + " Failed " + response.StatusCode);
            }

        }
    }
}
