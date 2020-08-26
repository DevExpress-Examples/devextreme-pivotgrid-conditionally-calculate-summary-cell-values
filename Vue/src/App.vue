<template>
<div>
  <div class="long-title">
    <h3>Sales Amount by Region</h3>
  </div>
  <DxPivotGrid
      ref="pivotGrid"
      id="sales"
      :allow-sorting-by-summary="true"
      :allow-sorting="true"
      :allow-filtering="true"
      :allow-expand-all="true"
      :height="440"
      :show-borders="true"
      :data-source="dataSource"
    >
      <DxFieldChooser :enabled="false"/>
    </DxPivotGrid>
    <div class="options">
            <div class="caption">Options</div>
            <div class="option">
                <DxCheckBox 
                  :value.sync="isConditional"
                  text="Toggle Conditional Summary Calculation"
                  @value-changed="onValueChanged"
                />
            </div>
        </div>
</div>
  
</template>

<script>
import DxPivotGrid, {
  DxFieldChooser
} from 'devextreme-vue/pivot-grid';
import DxCheckBox from 'devextreme-vue/check-box';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import { getSales } from './data.js';

export default {
  name: 'App',
  components: {
    DxPivotGrid,
    DxFieldChooser,
    DxCheckBox
  },
  data() {
    return {
      isConditional: true,
      dataSource: new PivotGridDataSource({
        fields: [
          {
            caption: 'Region',
            width: 120,
            dataField: 'region',
            area: 'row',
            expanded: true
          },
          {
            caption: 'City',
            dataField: 'city',
            width: 150,
            area: 'row',
            selector: function(data) {
              return `${data.city } (${ data.country })`;
            }
          },
          {
            dataField: 'date',
            dataType: 'date',
            area: 'column',
            expanded: true
          }, 
          {
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
        store: getSales()
      })
    };
  },
  methods: {
    onValueChanged() {
      let ds = this.pivotGrid.getDataSource()
      ds.reload()
    },
    calculateCustomSummary(options) {
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
              if (options.totalValue.count === 1 || !this.isConditional) {
                  // If not conditional, this block will always be run
                  options.totalValue = options.totalValue.rawVal;
              } else {
                  options.totalValue = options.totalValue.conditionalVal;
              }
      }
    }
  },
  computed: {
    pivotGrid: function() {
      return this.$refs.pivotGrid.instance;
    }
  }
}
</script>

<style scoped>
#sales {
  margin-top: 80px;
}

.long-title h3 {
  font-family: "Segoe UI Light", "Helvetica Neue Light", "Segoe UI",
    "Helvetica Neue", "Trebuchet MS", Verdana;
  font-weight: 200;
  font-size: 28px;
  text-align: center;
  margin-bottom: 20px;
}

.options {
    margin-top: 20px;
    padding: 20px;
    background: #f5f5f5;
}

.options .caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}

.option > span {
    width: 120px;
    display: inline-block;
}

.option > .dx-widget {
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    max-width: 350px;
}
</style>
