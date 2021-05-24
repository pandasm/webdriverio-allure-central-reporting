'Elastic Search Docker 
- https://hub.docker.com/r/nshou/elasticsearch-kibana

The XML report generated from Allure report after WebdriverIO script exection is stored in allure-reports.
Code will pick up the XML, convert into JSON and pickup essential high level details. The details are then pushed to Elastic Search.

The configuration of the elastic search can be changed in the configuration folder.
Although you may not need to tweak in the code but if you are server details then you need to update the same in the configuration file.

** Elastic Seach Configurations

On the elastic search side, a index is required to be created. In our case I have created the index as "automation-results" and the details can be changed in the configuration file. I also mentioned the type as "allure" which can be changed from the configuration file.

To create the index you can use:
- PUT automation-results

To create the index you can use:
- DELETE automation-results

To get the indices:
- GET _cat/indices

To count the records:
- GET /automation-results/allure/_count

To search the records:
- GET /automation-results/allure/_search


** Kibana configurations

Once you are done creating the index and pushing the data to the index, you can then go to stack management and create an index pattern. Once done you can do to the visualisations and can create the visualisations.