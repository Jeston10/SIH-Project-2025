// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AyurChakra Herb Traceability Contract
 * @dev Smart contract for tracking Ayurvedic herbs from cultivation to consumer
 * @author AyurChakra Team
 */
contract AyurChakraHerbTraceability {
    
    // Struct to represent a herb batch
    struct HerbBatch {
        uint256 batchId;
        string herbName;
        string scientificName;
        address farmer;
        string cultivationRegion;
        uint256 harvestTimestamp;
        string gpsCoordinates;
        uint256 quantity; // in grams
        string qualityGrade;
        bool isProcessed;
        bool isTested;
        bool isDistributed;
        address currentOwner;
        string[] qualityTestResults;
        string[] processingHistory;
    }
    
    // Struct for quality test results
    struct QualityTest {
        uint256 testId;
        uint256 batchId;
        address laboratory;
        string testType;
        uint256 activeCompoundPercentage;
        bool isAdulterated;
        string testResult;
        uint256 testTimestamp;
        string certificateHash;
    }
    
    // Struct for processing steps
    struct ProcessingStep {
        uint256 stepId;
        uint256 batchId;
        address processor;
        string processType;
        string processDetails;
        uint256 processTimestamp;
        string gpsLocation;
    }
    
    // State variables
    mapping(uint256 => HerbBatch) public herbBatches;
    mapping(uint256 => QualityTest) public qualityTests;
    mapping(uint256 => ProcessingStep) public processingSteps;
    mapping(address => bool) public authorizedFarmers;
    mapping(address => bool) public authorizedLaboratories;
    mapping(address => bool) public authorizedProcessors;
    
    uint256 public nextBatchId = 1;
    uint256 public nextTestId = 1;
    uint256 public nextStepId = 1;
    
    address public owner;
    uint256 public totalBatches;
    
    // Events
    event HerbBatchCreated(uint256 indexed batchId, string herbName, address farmer);
    event QualityTestAdded(uint256 indexed batchId, uint256 testId, address laboratory);
    event ProcessingStepAdded(uint256 indexed batchId, uint256 stepId, address processor);
    event OwnershipTransferred(uint256 indexed batchId, address from, address to);
    event AuthorizationGranted(address indexed account, string role);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorizedFarmer() {
        require(authorizedFarmers[msg.sender], "Only authorized farmers can perform this action");
        _;
    }
    
    modifier onlyAuthorizedLaboratory() {
        require(authorizedLaboratories[msg.sender], "Only authorized laboratories can perform this action");
        _;
    }
    
    modifier onlyAuthorizedProcessor() {
        require(authorizedProcessors[msg.sender], "Only authorized processors can perform this action");
        _;
    }
    
    modifier batchExists(uint256 _batchId) {
        require(_batchId > 0 && _batchId < nextBatchId, "Batch does not exist");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Create a new herb batch (only authorized farmers)
     */
    function createHerbBatch(
        string memory _herbName,
        string memory _scientificName,
        string memory _cultivationRegion,
        string memory _gpsCoordinates,
        uint256 _quantity,
        string memory _qualityGrade
    ) external onlyAuthorizedFarmer returns (uint256) {
        uint256 batchId = nextBatchId++;
        
        herbBatches[batchId] = HerbBatch({
            batchId: batchId,
            herbName: _herbName,
            scientificName: _scientificName,
            farmer: msg.sender,
            cultivationRegion: _cultivationRegion,
            harvestTimestamp: block.timestamp,
            gpsCoordinates: _gpsCoordinates,
            quantity: _quantity,
            qualityGrade: _qualityGrade,
            isProcessed: false,
            isTested: false,
            isDistributed: false,
            currentOwner: msg.sender,
            qualityTestResults: new string[](0),
            processingHistory: new string[](0)
        });
        
        totalBatches++;
        
        emit HerbBatchCreated(batchId, _herbName, msg.sender);
        return batchId;
    }
    
    /**
     * @dev Add quality test results (only authorized laboratories)
     */
    function addQualityTest(
        uint256 _batchId,
        string memory _testType,
        uint256 _activeCompoundPercentage,
        bool _isAdulterated,
        string memory _testResult,
        string memory _certificateHash
    ) external onlyAuthorizedLaboratory batchExists(_batchId) returns (uint256) {
        require(!herbBatches[_batchId].isTested, "Batch already tested");
        
        uint256 testId = nextTestId++;
        
        qualityTests[testId] = QualityTest({
            testId: testId,
            batchId: _batchId,
            laboratory: msg.sender,
            testType: _testType,
            activeCompoundPercentage: _activeCompoundPercentage,
            isAdulterated: _isAdulterated,
            testResult: _testResult,
            testTimestamp: block.timestamp,
            certificateHash: _certificateHash
        });
        
        herbBatches[_batchId].isTested = true;
        herbBatches[_batchId].qualityTestResults.push(_testResult);
        
        emit QualityTestAdded(_batchId, testId, msg.sender);
        return testId;
    }
    
    /**
     * @dev Add processing step (only authorized processors)
     */
    function addProcessingStep(
        uint256 _batchId,
        string memory _processType,
        string memory _processDetails,
        string memory _gpsLocation
    ) external onlyAuthorizedProcessor batchExists(_batchId) returns (uint256) {
        uint256 stepId = nextStepId++;
        
        processingSteps[stepId] = ProcessingStep({
            stepId: stepId,
            batchId: _batchId,
            processor: msg.sender,
            processType: _processType,
            processDetails: _processDetails,
            processTimestamp: block.timestamp,
            gpsLocation: _gpsLocation
        });
        
        herbBatches[_batchId].processingHistory.push(_processDetails);
        
        emit ProcessingStepAdded(_batchId, stepId, msg.sender);
        return stepId;
    }
    
    /**
     * @dev Transfer ownership of herb batch
     */
    function transferOwnership(uint256 _batchId, address _newOwner) 
        external 
        batchExists(_batchId) 
    {
        require(msg.sender == herbBatches[_batchId].currentOwner, "Only current owner can transfer");
        require(_newOwner != address(0), "Invalid new owner address");
        
        address previousOwner = herbBatches[_batchId].currentOwner;
        herbBatches[_batchId].currentOwner = _newOwner;
        
        emit OwnershipTransferred(_batchId, previousOwner, _newOwner);
    }
    
    /**
     * @dev Mark batch as processed
     */
    function markAsProcessed(uint256 _batchId) 
        external 
        onlyAuthorizedProcessor 
        batchExists(_batchId) 
    {
        require(herbBatches[_batchId].isTested, "Batch must be tested before processing");
        herbBatches[_batchId].isProcessed = true;
    }
    
    /**
     * @dev Mark batch as distributed
     */
    function markAsDistributed(uint256 _batchId) 
        external 
        batchExists(_batchId) 
    {
        require(msg.sender == herbBatches[_batchId].currentOwner, "Only current owner can mark as distributed");
        require(herbBatches[_batchId].isProcessed, "Batch must be processed before distribution");
        herbBatches[_batchId].isDistributed = true;
    }
    
    /**
     * @dev Get complete herb batch information
     */
    function getHerbBatch(uint256 _batchId) 
        external 
        view 
        batchExists(_batchId) 
        returns (HerbBatch memory) 
    {
        return herbBatches[_batchId];
    }
    
    /**
     * @dev Get quality test results for a batch
     */
    function getQualityTests(uint256 _batchId) 
        external 
        view 
        batchExists(_batchId) 
        returns (QualityTest[] memory) 
    {
        uint256 testCount = 0;
        
        // Count tests for this batch
        for (uint256 i = 1; i < nextTestId; i++) {
            if (qualityTests[i].batchId == _batchId) {
                testCount++;
            }
        }
        
        // Create array and populate
        QualityTest[] memory tests = new QualityTest[](testCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i < nextTestId; i++) {
            if (qualityTests[i].batchId == _batchId) {
                tests[index] = qualityTests[i];
                index++;
            }
        }
        
        return tests;
    }
    
    /**
     * @dev Get processing steps for a batch
     */
    function getProcessingSteps(uint256 _batchId) 
        external 
        view 
        batchExists(_batchId) 
        returns (ProcessingStep[] memory) 
    {
        uint256 stepCount = 0;
        
        // Count steps for this batch
        for (uint256 i = 1; i < nextStepId; i++) {
            if (processingSteps[i].batchId == _batchId) {
                stepCount++;
            }
        }
        
        // Create array and populate
        ProcessingStep[] memory steps = new ProcessingStep[](stepCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i < nextStepId; i++) {
            if (processingSteps[i].batchId == _batchId) {
                steps[index] = processingSteps[i];
                index++;
            }
        }
        
        return steps;
    }
    
    /**
     * @dev Get herb traceability chain
     */
    function getTraceabilityChain(uint256 _batchId) 
        external 
        view 
        batchExists(_batchId) 
        returns (
            HerbBatch memory batch,
            QualityTest[] memory tests,
            ProcessingStep[] memory steps
        ) 
    {
        batch = herbBatches[_batchId];
        tests = this.getQualityTests(_batchId);
        steps = this.getProcessingSteps(_batchId);
    }
    
    // Admin functions
    function authorizeFarmer(address _farmer) external onlyOwner {
        authorizedFarmers[_farmer] = true;
        emit AuthorizationGranted(_farmer, "Farmer");
    }
    
    function authorizeLaboratory(address _laboratory) external onlyOwner {
        authorizedLaboratories[_laboratory] = true;
        emit AuthorizationGranted(_laboratory, "Laboratory");
    }
    
    function authorizeProcessor(address _processor) external onlyOwner {
        authorizedProcessors[_processor] = true;
        emit AuthorizationGranted(_processor, "Processor");
    }
    
    function revokeFarmerAuthorization(address _farmer) external onlyOwner {
        authorizedFarmers[_farmer] = false;
    }
    
    function revokeLaboratoryAuthorization(address _laboratory) external onlyOwner {
        authorizedLaboratories[_laboratory] = false;
    }
    
    function revokeProcessorAuthorization(address _processor) external onlyOwner {
        authorizedProcessors[_processor] = false;
    }
    
    // Utility functions
    function getTotalBatches() external view returns (uint256) {
        return totalBatches;
    }
    
    function isAuthorizedFarmer(address _farmer) external view returns (bool) {
        return authorizedFarmers[_farmer];
    }
    
    function isAuthorizedLaboratory(address _laboratory) external view returns (bool) {
        return authorizedLaboratories[_laboratory];
    }
    
    function isAuthorizedProcessor(address _processor) external view returns (bool) {
        return authorizedProcessors[_processor];
    }
}
