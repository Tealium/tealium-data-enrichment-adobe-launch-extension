# Tealium Data Enrichment Extension for Adobe Launch

## Overview

*NOTE: As of Feb 2021 this integration is not-yet-approved for the Adobe Launch marketplace of extensions.*

This is the Adobe Launch Extension for Tealium Data Enrichment.

The Tealium Data Enrichment Extension for Adobe Launch allows you to enable and configure client-side data enrichment for Tealium's Customer Data Hub (CDH) on your website using Adobe Launch.  This allows your website visitor attributes to be retreived from the CDH and leveraged in the browser.

For more information on Tealium's CDH, please visit [Tealium's Learning Community](https://community.tealiumiq.com/t5/Customer-Data-Hub/Introduction-to-Customer-Data-Hub/ta-p/17571)

## Quickstart Configuration

1. Search for the "Tealium Data Enrichment" Extension in the Adobe Extension Catalog
2. Click Install button to add this Extension
3. Add a Rule and Action for "Tealium Data Enrichment"
4. Enter the Tealium Account and Profile obtained from Tealium's CDH
5. Create a new Data Element in Adobe Launch to read the data in Local Storage

```
// Example code only
var myData = JSON.parse(localStorage.getItem("teal_adbe_enrichment_data"));

return JSON.stringify(myData.properties);
```
6. Publish


## Features

1. Custom Endpoint

Configure with your first-party data endpoint.

## Copyright and license

Copyright 2021 Tealium, Inc. All rights reserved.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

