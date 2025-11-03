let isConditional = true;

$(() => {
  sales.forEach((sale, index) => {
    sale.isApproved = index % 2 !== 0;
  });

  const pivotGrid = $('#sales').dxPivotGrid({
    allowSortingBySummary: true,
    allowSorting: true,
    allowFiltering: true,
    allowExpandAll: true,
    height: 440,
    showColumnGrandTotals: false,
    showColumnTotals: false,
    showBorders: true,
    fieldChooser: {
      enabled: false,
    },
    dataSource: {
      fields: [
        {
          caption: 'Region',
          width: 120,
          dataField: 'region',
          area: 'row',
          expanded: true,
        },
        {
          caption: 'City',
          dataField: 'city',
          width: 150,
          area: 'row',
          selector: (data) => `${data.city} (${data.country})`,
        },
        {
          dataField: 'date',
          dataType: 'date',
          area: 'column',
          expanded: true,
        },
        {
          caption: 'Sales',
          dataType: 'number',
          summaryType: 'custom',
          format: 'currency',
          area: 'data',
          calculateCustomSummary,
        },
        {
          caption: 'Approved',
          dataField: 'isApproved',
          summaryType: 'sum',
          area: 'data',
        },
      ],
      store: sales,
    },
  })
    .dxPivotGrid('instance');

  $('#toggleConditionalSummary').dxCheckBox({
    value: isConditional,
    text: 'Toggle Conditional Summary Calculation',
    onValueChanged: (arg) => {
      isConditional = arg.value;
      pivotGrid.getDataSource().reload();
    },
  });
});

function calculateCustomSummary(options) {
  switch (options.summaryProcess) {
    case 'start':
      options.totalValue = { conditionalVal: 0, rawVal: 0, count: 0 };
      break;
    case 'calculate':
      options.totalValue.count += 1;
      options.totalValue.rawVal += options.value.amount;
      if (options.value.isApproved) {
        options.totalValue.conditionalVal += options.value.amount;
      }
      break;
    case 'finalize':
      if (options.totalValue.count === 1 || !isConditional) {
        options.totalValue = options.totalValue.rawVal;
      } else {
        options.totalValue = options.totalValue.conditionalVal;
      }
      break;
    default: break;
  }
}
