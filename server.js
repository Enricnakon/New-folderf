const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Assuming these are your existing models
const { TaxPayerModel, AssetModel,IncomeTaxModel } = require('./models');
 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://juma:juma@cluster0.tvrxlqa.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Route for serving the tax payer registration form
app.get('/rTpayer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rTpayer.html'));
});

// Route for handling tax payer registration
app.post('/rTpayer', async (req, res) => {
    const generatedTIN = generateRandomTIN();

    const taxpayerData = new TaxPayerModel({
       

       


        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        occupation: req.body.occupation,
        gender: req.body.gender,
        phoneNumber: req.body.phoneNumber ,
        emailAddress: req.body.emailAddress,
        expectedAnnualIncome: req.body.expectedAnnualIncome,
        tin: generatedTIN
    






    });


    try {
        await taxpayerData.save();
        res.send(`<script>alert('Registration successful! Your TIN is: ${generatedTIN}'); window.location.href='/rTpayer';</script>`);
    } catch (error) {
        res.status(500).send('Error submitting tax payer registration form');
    }
});

// Route for serving the asset registration form
app.get('/rAsset', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rAsset.html'));
});

// Route for handling asset registration
app.post('/rAsset', async (req, res) => {
    const assetData = new AssetModel({
       
       
       
       
       
       
       
       
        assetName: req.body.assetName,
        estimatedCost: req.body.estimatedCost,
        ownerTIN: req.body.ownerTIN,
        type: req.body.type,
        AssetCode: generateRandomAssetCode()
        
       
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    });


    try {
        await assetData.save();
        const alertMessage = `Asset registration successful! Your Asset Code is: ${assetData.AssetCode}`;
        res.send(`<script>alert('${alertMessage}'); window.location.href='/rAsset';</script>`);
    } catch (error) {
        res.status(500).send('Error submitting asset registration form');
    }
});

// Route for searching tax payer by TIN
// Route for searching tax payer by TIN
app.post('/searchPayer', async (req, res) => {
    const tinToSearch = req.body.tin;

    try {
        let query = {};
        if (tinToSearch) {
            query = { tin: tinToSearch };
        }

        const result = await TaxPayerModel.find(query);

        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).send({ error: 'Payer not found', tin: tinToSearch });
        }
    } catch (error) {
        console.error('Error searching payer:', error);
        res.status(500).send('Error searching payer');
    }
});


 
// Route for searching asset by asset code
// Route for searching asset by asset code
app.post('/searchAsset', async (req, res) => {
    const AssetCodeToSearch = req.body.AssetCode;

    try {
        const result = await AssetModel.findOne({ AssetCode: AssetCodeToSearch });

        if (result) {
            res.json(result);
        } else {
            res.status(404).json({ error: 'Asset not found', AssetCode: AssetCodeToSearch });
        }
    } catch (error) {
        console.error('Error searching asset:', error);
        res.status(500).json({ error: 'Error searching asset' });
    }
});


// Route for fetching tax payers
app.get('/getTaxPayers', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = 10; // Adjust the page size as needed
        const skip = (page - 1) * pageSize;

        const taxPayers = await TaxPayerModel.find().skip(skip).limit(pageSize);
        res.json({ taxPayers });
    } catch (error) {
        console.error('Error fetching tax payers:', error);
        res.status(500).send('Error fetching tax payers');
    }
});

// Route for fetching assets
app.get('/getAssets', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const pageSize = 10; // Adjust the page size as needed
        const skip = (page - 1) * pageSize;

        const assets = await AssetModel.find().skip(skip).limit(pageSize);
        res.json({ assets });
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).send('Error fetching assets');
    }
});

// Route for recording income tax payment
app.post('/payIncomeTax', async (req, res) => {
    const { tin, totalProfits, taxPayable } = req.body;

    try {
        // Save the payment details to the database
        const paymentData = new IncomeTaxModel({
            tin,
            totalProfits,
            taxPayable
        });

        await paymentData.save();

        // Send a response to the client
        res.status(200).json({ message: 'Income tax payment recorded successfully' });
    } catch (error) {
        console.error('Error recording income tax payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Helper function to generate a random TIN
function generateRandomTIN() {
    return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}

// Helper function to generate a random asset code
function generateRandomAssetCode() {
    return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
}
