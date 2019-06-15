const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sstk = require('shutterstock-api');
const port = process.env.PORT || 5000;

app.use(bodyParser.text());
app.use(cors());

const applicationClientId = '92b7d-3031f-fb374-69110-4ae1a-c7799';
const applicationClientSecret = '78e84-f4853-6280e-df705-5b5c5-1ba1d';
sstk.setBasicAuth(applicationClientId, applicationClientSecret);
const imagesApi = new sstk.ImagesApi();

const fetchImages = async query => {
  query = JSON.parse(query);
  return await imagesApi.searchImages({
    query: query.search,
    image_type: 'photo',
    page: query.page,
    per_page: 25,
    sort: 'relevance',
    orientation: 'horizontal'
  });
};

app.get('/', (req, res) => {
  res.send('Working well..');
});

app.post('/get-images', (req, res) => {
  fetchImages(req.body)
    .then(data => {
      res.json({ success: true, data: data.data });
    })
    .catch(e => {
      console.error(e);
      return res.json({ success: false, message: 'ShutterStock API Error!' });
    });
});

app.listen(port, () => {
  console.log('Server live on port ' + port);
});
