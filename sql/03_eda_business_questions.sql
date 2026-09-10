--1.Overall churn rate

SELECT
	CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float) churned_customer,
	COUNT(*) AS total_customer,
	CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float)/ COUNT(*) * 100 AS churn_rate_percent
FROM customerchurn

--FINDING:Overall churn rate is 26.5% — roughly 1 in 4 customers churned in this dataset.

--2.Churn rate by Contract type

SELECT
	Contract AS contract_type,
	CAST(COUNT(CASE WHEN Churn = 'Yes' THEN 1 END) AS float) AS churned_customers,
    COUNT(*) AS total_customers,
	ROUND(CAST(COUNT(CASE WHEN Churn = 'Yes' THEN 1 END) AS float) / COUNT(*) * 100, 2) AS churn_rate_percent
FROM customerchurn
GROUP BY Contract
ORDER BY churn_rate_percent DESC
--FINDING: There are 3 contract types where the churn rate for month to month is highest followed by one year then two year

--3.Churn rate by PaymentMethod
SELECT
	PaymentMethod AS payment_methods,
	CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float) churned_customer,
	COUNT(*) AS total_customer,
	ROUND(CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float)/ COUNT(*) * 100 , 2)AS churn_rate_percent
FROM customerchurn
GROUP BY PaymentMethod
ORDER BY churn_rate_percent DESC
--FINDING: month-to-month + electronic check = high-risk profile.

--4. Churn rate by InternetService
SELECT
	InternetService AS internet_services,
	CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float) churned_customer,
	COUNT(*) AS total_customer,
	ROUND(CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float)/ COUNT(*) * 100 , 2)AS churn_rate_percent
FROM customerchurn
GROUP BY InternetService
ORDER BY churn_rate_percent DESC

--5. Avg MonthlyCharges/TotalCharges_Cleaned: churned vs. retained
SELECT
	Churn,
	ROUND(AVG(MonthlyCharges),2) AS avg_monthly_charges,
	ROUND(AVG(TotalCharges_Cleaned) ,2)AS avg_total_charges
FROM customerchurn
GROUP BY Churn
--FINDING: Leaving customers pay more montly charges and lower total charges as MONTHLY CHARGE=SNAPSHOT & TOTAL CHARGE= CUMULATIVE

--6. Churn rate for tenure < 12 months vs. tenure ≥ 12 months

SELECT
	CASE
		WHEN tenure < 12 THEN 'New (<12 months)' 
		WHEN tenure >= 12 THEN 'Established'
	END AS tenure_details,
	CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float) churned_customer,
	COUNT(*) AS total_customer,
	ROUND(CAST(COUNT(CASE WHEN Churn='Yes' THEN 1 END) AS float)/ COUNT(*) * 100 , 2)AS churn_rate_percent
FROM customerchurn
GROUP BY CASE
		WHEN tenure < 12 THEN 'New (<12 months)' 
		WHEN tenure >= 12 THEN 'Established'
	END
--FINDING:New customers churn at nearly 3x the rate of established customers.




SELECT * FROM customerchurn