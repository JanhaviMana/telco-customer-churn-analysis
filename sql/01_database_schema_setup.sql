
CREATE TABLE dbo.customerchurn (
    customerID     VARCHAR(15) PRIMARY KEY ,
    gender            VARCHAR(50),
    SeniorCitizen     VARCHAR(50),
    Partner           VARCHAR(50),
    Dependents        VARCHAR(50),
    tenure           INT,
    PhoneService      VARCHAR(50),
    MultipleLines     VARCHAR(50),
    InternetService   VARCHAR(50),
    OnlineSecurity    VARCHAR(50),
    OnlineBackup      VARCHAR(50),
    DeviceProtection  VARCHAR(50),
    TechSupport       VARCHAR(50),
    StreamingTV       VARCHAR(50),
    StreamingMovies   VARCHAR(50),
    Contract          VARCHAR(50),
    PaperlessBilling  VARCHAR(50),
    PaymentMethod     VARCHAR(50),
    MonthlyCharges    DECIMAL(5,2),
    TotalCharges      VARCHAR(50),
    Churn             VARCHAR(50)
);
BULK INSERT dbo.customerchurn
FROM 'C:\Users\LOQ\OneDrive\Desktop\PROJECTS\Customer Churn\WA_Fn-UseC_-Telco-Customer-Churn.csv'
WITH (
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    TABLOCK
);


SELECT COUNT(*) FROM dbo.customerchurn;

SELECT customerID, tenure, TotalCharges FROM dbo.customerchurn WHERE tenure = 0;

SELECT DISTINCT OnlineSecurity FROM dbo.customerchurn;
SELECT DISTINCT MultipleLines FROM dbo.customerchurn;