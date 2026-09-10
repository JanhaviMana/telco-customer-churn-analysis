/* =====================================================
 02_data_cleaning.sql
 Purpose: Clean TotalCharges column (imported as VARCHAR
 due to 11 blank values for tenure=0 customers).
 Converts valid values to FLOAT, preserves original column
 for auditability, and adds a new cleaned column.
 =====================================================*/

-- Add new column to hold cleaned numeric values
ALTER TABLE dbo.customerchurn ADD TotalCharges_Cleaned FLOAT;

-- Populate cleaned column:
/* NULL used instead of 0: tenure=0 means no billing cycle has occurred yet,
so 0 would misrepresent these customers as having paid nothing.*/
UPDATE dbo.customerchurn 
SET TotalCharges_Cleaned = 
    CASE 
        WHEN TotalCharges = '' THEN NULL
        ELSE TRY_CAST(TotalCharges AS FLOAT)
    END;

-- =====================================================
-- Verification
-- =====================================================

-- Confirm tenure=0 rows: original blank, cleaned = NULL
SELECT customerID, TotalCharges, TotalCharges_Cleaned 
FROM dbo.customerchurn 
WHERE tenure = 0;

-- Spot check normal rows: original text matches cleaned numeric value
SELECT TOP 10 customerID, TotalCharges, TotalCharges_Cleaned 
FROM dbo.customerchurn 
WHERE tenure > 0;

-- Confirm count: 7043 total - 11 blanks = 7032 non-null cleaned values
SELECT COUNT(*) AS non_null_cleaned_count 
FROM dbo.customerchurn 
WHERE TotalCharges_Cleaned IS NOT NULL;