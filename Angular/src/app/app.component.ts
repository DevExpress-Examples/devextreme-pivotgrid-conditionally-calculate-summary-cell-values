import { Component, ViewChild } from '@angular/core';
import { Service, Sale } from './app.service';
import { DxPivotGridComponent } from "devextreme-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service]
})
export class AppComponent {
    @ViewChild(DxPivotGridComponent, {static: false}) pivotGrid: DxPivotGridComponent;
    sales: Sale[];
    dataSource: any;
    isConditional: boolean = true;

    constructor(service: Service) {
      let tempSales: any = service.getSales();
      
      tempSales.forEach((sale, index) => {
        sale.isApproved = index % 2 !== 0;
      });

      this.sales = tempSales;

      this.dataSource = {
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
              selector: this.citySelector
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
              calculateCustomSummary: this.calculateCustomSummary
          },
          {
              caption: "Approved",
              dataField: "isApproved",
              summaryType: "sum",
              area: "data"
          }],
          store: this.sales
      }

  }

  calculateCustomSummary = (options) => {
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
          debugger;
            if (options.totalValue.count === 1 || !this.isConditional) {
                // If not conditional, this block will always be run
                options.totalValue = options.totalValue.rawVal;
            } else {
                options.totalValue = options.totalValue.conditionalVal;
            }
    }
}

  onValueChanged(data) {
    let ds = this.pivotGrid.instance.getDataSource()
    ds.reload()
  }

  citySelector(data) {
      return data.city + ' (' + data.country + ')';
  }
}
