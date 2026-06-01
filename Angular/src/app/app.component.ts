import { Component, ViewChild } from '@angular/core';
import { DxCheckBoxModule, DxPivotGridComponent, DxPivotGridModule } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Sale, Service } from './app.service';

interface CustomSummaryValue {
  summaryProcess?: string;
  value?: any;
  totalValue?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [DxPivotGridModule, DxCheckBoxModule],
  providers: [Service],
})
export class AppComponent {
  @ViewChild('sales') pivotGrid!: DxPivotGridComponent;

  sales: Sale[];

  dataSource: PivotGridDataSource;

  isConditional = true;

  constructor(service: Service) {
    let tempSales: any = service.getSales();

    tempSales.forEach((sale: Sale, index: number) => {
      sale.isApproved = index % 2 !== 0;
    });

    this.sales = tempSales;

    this.dataSource = new PivotGridDataSource({
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
        selector: (data: Sale): string => `${data.city} (${data.country})`,
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
        calculateCustomSummary: this.calculateCustomSummary,
      },
      {
        caption: 'Approved',
        dataField: 'isApproved',
        summaryType: 'sum',
        area: 'data',
      }],
      store: this.sales,
    });
  }

  calculateCustomSummary = (options: CustomSummaryValue): void => {
    switch (options.summaryProcess) {
      case 'start':
        options.totalValue = { conditionalVal: 0, rawVal: 0, count: 0 };
        break;
      case 'calculate':
        options.totalValue.count += 1;
        options.totalValue.rawVal += (options.value.amount as number);
        if (options.value.isApproved) {
          options.totalValue.conditionalVal += (options.value.amount as number);
        }
        break;
      case 'finalize':
        if (options.totalValue.count === 1 || !this.isConditional) {
          options.totalValue = options.totalValue.rawVal;
        } else {
          options.totalValue = options.totalValue.conditionalVal;
        }
        break;
      default: break;
    }
  };

  toggleConditionalChanged(): void {
    this.pivotGrid.instance.getDataSource().reload().catch(() => {});
  }
}
