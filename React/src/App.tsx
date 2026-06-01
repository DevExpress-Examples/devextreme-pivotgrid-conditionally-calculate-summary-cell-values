import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import {
  useMemo, useState, useRef, useCallback,
} from 'react';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import PivotGrid, { FieldChooser, type PivotGridRef } from 'devextreme-react/pivot-grid';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import service, { type Sale } from './service.ts';
import './App.css';

interface CustomSummaryValue {
  summaryProcess?: string;
  value?: any;
  totalValue?: any;
}

const tempSales = service.getSales();

tempSales.forEach((sale: Sale, index: number) => {
  sale.isApproved = index % 2 !== 0;
});

const sales = tempSales;

function citySelector(data: Sale): string {
  return `${data.city} (${data.country})`;
}

function App(): JSX.Element {
  const [isConditional, setIsConditional] = useState(true);
  const isConditionalRef = useRef(isConditional);
  const pivotGridRef = useRef<PivotGridRef>(null);

  isConditionalRef.current = isConditional;

  const calculateCustomSummary = useCallback((options: CustomSummaryValue) => {
    switch (options.summaryProcess) {
      case 'start':
        options.totalValue = { conditionalVal: 0, rawVal: 0, count: 0 };
        break;
      case 'calculate':
        options.totalValue.count = (options.totalValue.count as number) + 1;
        options.totalValue.rawVal = (options.totalValue.rawVal as number) + (options.value.amount as number);
        if (options.value.isApproved) {
          options.totalValue.conditionalVal = (options.totalValue.conditionalVal as number) + (options.value.amount as number);
        }
        break;
      case 'finalize':
        if (options.totalValue.count === 1 || !isConditionalRef.current) {
          options.totalValue = options.totalValue.rawVal;
        } else {
          options.totalValue = options.totalValue.conditionalVal;
        }
        break;
      default: break;
    }
  }, []);

  const dataSource = useMemo<PivotGridDataSource>(() => new PivotGridDataSource({
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
      expanded: true,
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
      selector: citySelector,
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
      expanded: true,
    }, {
      caption: 'Sales',
      dataType: 'number',
      summaryType: 'custom',
      format: 'currency',
      area: 'data',
      calculateCustomSummary,
    }, {
      caption: 'Approved',
      dataField: 'isApproved',
      summaryType: 'sum',
      area: 'data',
    }],
    store: sales,
  }), [calculateCustomSummary]);

  const onValueChanged = useCallback((arg: CheckBoxTypes.ValueChangedEvent) => {
    setIsConditional(arg.value);
    pivotGridRef.current?.instance().getDataSource().reload().catch(() => {});
  }, []);

  return (
    <div className="app">
      <div className="long-title"><h3>Conditional Summary Calculation</h3></div>
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
