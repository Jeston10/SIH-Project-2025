// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AyurChakra {
    // Events for tracking
    event HarvestRecorded(
        string indexed harvestId,
        string indexed farmerId,
        string cropData,
        string locationData,
        uint256 timestamp
    );
    
    event ProcessingRecorded(
        string indexed processingId,
        string indexed harvestId,
        string processingData,
        uint256 timestamp
    );
    
    event QualityTestRecorded(
        string indexed testId,
        string indexed batchId,
        string testResults,
        uint256 timestamp
    );
    
    event SupplyChainUpdated(
        string indexed supplyChainId,
        string updateData,
        uint256 timestamp
    );

    // Structs for data storage
    struct HarvestRecord {
        string harvestId;
        string farmerId;
        string cropData;
        string locationData;
        uint256 timestamp;
        bool exists;
    }
    
    struct ProcessingRecord {
        string processingId;
        string harvestId;
        string processingData;
        uint256 timestamp;
        bool exists;
    }
    
    struct QualityTestRecord {
        string testId;
        string batchId;
        string testResults;
        uint256 timestamp;
        bool exists;
    }

    // Storage mappings
    mapping(string => HarvestRecord) public harvests;
    mapping(string => ProcessingRecord) public processings;
    mapping(string => QualityTestRecord) public qualityTests;
    
    // Owner of the contract
    address public owner;
    
    // Modifier to restrict access to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    // Function to record harvest data
    function recordHarvest(
        string memory _harvestId,
        string memory _farmerId,
        string memory _cropData,
        string memory _locationData
    ) public onlyOwner {
        require(!harvests[_harvestId].exists, "Harvest already exists");
        
        harvests[_harvestId] = HarvestRecord({
            harvestId: _harvestId,
            farmerId: _farmerId,
            cropData: _cropData,
            locationData: _locationData,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit HarvestRecorded(_harvestId, _farmerId, _cropData, _locationData, block.timestamp);
    }
    
    // Function to record processing data
    function recordProcessing(
        string memory _processingId,
        string memory _harvestId,
        string memory _processingData
    ) public onlyOwner {
        require(harvests[_harvestId].exists, "Harvest does not exist");
        require(!processings[_processingId].exists, "Processing already exists");
        
        processings[_processingId] = ProcessingRecord({
            processingId: _processingId,
            harvestId: _harvestId,
            processingData: _processingData,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit ProcessingRecorded(_processingId, _harvestId, _processingData, block.timestamp);
    }
    
    // Function to record quality test results
    function recordQualityTest(
        string memory _testId,
        string memory _batchId,
        string memory _testResults
    ) public onlyOwner {
        require(!qualityTests[_testId].exists, "Quality test already exists");
        
        qualityTests[_testId] = QualityTestRecord({
            testId: _testId,
            batchId: _batchId,
            testResults: _testResults,
            timestamp: block.timestamp,
            exists: true
        });
        
        emit QualityTestRecorded(_testId, _batchId, _testResults, block.timestamp);
    }
    
    // Function to update supply chain
    function updateSupplyChain(
        string memory _supplyChainId,
        string memory _updateData
    ) public onlyOwner {
        emit SupplyChainUpdated(_supplyChainId, _updateData, block.timestamp);
    }
    
    // Function to get harvest data
    function getHarvest(string memory _harvestId) public view returns (
        string memory harvestId,
        string memory farmerId,
        string memory cropData,
        string memory locationData,
        uint256 timestamp,
        bool exists
    ) {
        HarvestRecord memory harvest = harvests[_harvestId];
        return (
            harvest.harvestId,
            harvest.farmerId,
            harvest.cropData,
            harvest.locationData,
            harvest.timestamp,
            harvest.exists
        );
    }
    
    // Function to get processing data
    function getProcessing(string memory _processingId) public view returns (
        string memory processingId,
        string memory harvestId,
        string memory processingData,
        uint256 timestamp,
        bool exists
    ) {
        ProcessingRecord memory processing = processings[_processingId];
        return (
            processing.processingId,
            processing.harvestId,
            processing.processingData,
            processing.timestamp,
            processing.exists
        );
    }
    
    // Function to get quality test data
    function getQualityTest(string memory _testId) public view returns (
        string memory testId,
        string memory batchId,
        string memory testResults,
        uint256 timestamp,
        bool exists
    ) {
        QualityTestRecord memory test = qualityTests[_testId];
        return (
            test.testId,
            test.batchId,
            test.testResults,
            test.timestamp,
            test.exists
        );
    }
    
    // Function to verify data integrity
    function verifyHarvest(string memory _harvestId) public view returns (bool) {
        return harvests[_harvestId].exists;
    }
    
    function verifyProcessing(string memory _processingId) public view returns (bool) {
        return processings[_processingId].exists;
    }
    
    function verifyQualityTest(string memory _testId) public view returns (bool) {
        return qualityTests[_testId].exists;
    }
    
    // Function to get contract info
    function getContractInfo() public view returns (
        address contractOwner,
        uint256 blockNumber,
        uint256 timestamp
    ) {
        return (owner, block.number, block.timestamp);
    }
}
