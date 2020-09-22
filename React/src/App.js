import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import PivotGrid, { FieldChooser} from 'devextreme-react/pivot-grid'
import CheckBox from 'devextreme-react/check-box'
import service from './service'

let tempSales = service.getSales();
      
tempSales.forEach((sale, index) => {
  sale.isApproved = index % 2 !== 0;
});

const sales = tempSales;
const pivotGridRef = React.createRef();

function App() {
  const [isConditional, setIsConditional] = useState(true)
  
  const dataSource = useMemo(() => { 
    return {
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        expanded: true
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
        selector: citySelector
      }, {
        dataField: 'date',
        dataType: 'date',
        area: 'column',
        expanded: true
      }, {
        caption: 'Sales',
        dataType: 'number',
        summaryType: 'custom',
        format: 'currency',
        area: 'data',
        calculateCustomSummary: calculateCustomSummary
      },{
        caption: "Approved",
        dataField: "isApproved",
        summaryType: "sum",
        area: "data"
      }],
      store: sales
    }
  }, [isConditional])
    
  function calculateCustomSummary(options) {
    switch (options.summaryProcess) {
        case "start":
            options.totalValue = { conditionalVal: 0, rawVal: 0, count: 0 };
            break;
        case "calculate":
            options.totalValue.count += 1;
            options.totalValue.rawVal += options.value.amount;
            if (options.value.isApproved) {
                options.totalValue.conditionalVal += options.value.amount;
            }
            break;
        case "finalize":
            if (options.totalValue.count === 1 || !isConditional) {
                // If not conditional, this block will always be run
                options.totalValue = options.totalValue.rawVal;
            } else {
                options.totalValue = options.totalValue.conditionalVal;
            }
    }
  }

  function onValueChanged({value}) {
    setIsConditional(value)
  }

  return (
    <div className="App">
      <div className="long-title"><h3>Sales Amount by Region</h3></div>
      <PivotGrid id="sales"
        ref={pivotGridRef}
        allowSortingBySummary={true}
        allowSorting={true}
        allowFiltering={true}
        allowExpandAll={true}
        height={440}
        showBorders={true}
        dataSource={dataSource}>
        <FieldChooser enabled={false} />
      </PivotGrid>

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
            <CheckBox
              value={isConditional}
              text="Toggle Conditional Summary Calculation"
              onValueChanged={onValueChanged} />
        </div>
      </div>
    </div>
  );
}

export default App;

function citySelector(data) {
  return data.city + ' (' + data.country + ')';
}
