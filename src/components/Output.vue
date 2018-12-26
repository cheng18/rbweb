<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="age"
            label="年齡"
            required
          ></v-text-field>
          <v-text-field
            v-model="retirementAge"
            label="退休年齡"
            required
          ></v-text-field>
          <v-text-field
            v-model="salary"
            label="年薪資out"
            required
          ></v-text-field>
          <v-text-field
            v-model="capital"
            label="目前儲蓄或負載"
            required
          ></v-text-field>
          <v-text-field
            v-model="expenses"
            label="年支出"
            required
          ></v-text-field>
          <v-text-field
            v-model="ROI"
            label="投資年化報酬率"
            required
          ></v-text-field>
          <v-text-field
            v-model="rentPrice"
            label="租金"
            required
          ></v-text-field>
          <v-text-field
            v-model="housePrice"
            label="房價"
            required
          ></v-text-field>
          <!-- <v-text-field
            v-model="space"
            label="居住坪數"
            required
          ></v-text-field>
          <v-text-field
            v-model="area"
            label="居住區域"
            required
          ></v-text-field> -->
          <v-text-field
            v-model="boomVolatility_salary"
            label="所得-景氣波動率"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomExpected_salary"
            label="所得-期望值"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomVolatility_price"
            label="物價-景氣波動率"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomExpected_price"
            label="物價-期望值"
            required
          ></v-text-field>

          <v-btn
            @click="submit"
          >
            submit
          </v-btn>
          <v-btn @click="clear">clear</v-btn>
        </v-form>
        <p></p>
        <p>租房結果：{{result}}</p>
        <p>Std：{{resultStd}}</p>
        <p>Max：{{resultMax}}</p>
        <p>Min：{{resultMin}}</p>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import * as test from '@/assets/test';
import s from 'stochastic';
import * as math from 'mathjs'
export default {
  name: 'Output',
  props: {
  },
  data: () => ({
        age: 30,
        retirementAge: 65,
        salary: 1258715,
        capital: 3000000,
        expenses: 690913,
        ROI: 2.5,
        rentPrice: 143040,
        housePrice: 5100000,
        space: null,
        area: null,
        boomVolatility_salary: 0.1,
        boomExpected_salary: 0,
        boomVolatility_price: 0.1,
        boomExpected_price: 0,
        result: null,
        resultStd: null,
        resultMax: null,
        resultMin: null
  }),
  methods: {
    submit () {
      var range = this.retirementAge - this.age;
      var MCnumber = 1000; // number of times in Monte Carlo simulation
      var salaryMC = [];
      var expensesMC = [];
      var rentPriceMC = [];
      var resultMC = [];
      var resultSum = new Array(range);
      var ROI = this.ROI * 0.01 + 1;

      resultSum.fill(0, 0, range);

      for (var i = 0; i < MCnumber; i++) {
        // 計算各表之幾何布朗運動
        var gbm_salary = s.GBM(1, this.boomExpected_salary, this.boomVolatility_salary,
                               range, range, true);
        var gbm_pirce = s.GBM(1, this.boomExpected_price, this.boomVolatility_price, 
                              range, range, true);

        salaryMC[i] = gbm_salary.map(value => value * this.salary);
        expensesMC[i] = gbm_pirce.map(value => value * this.expenses);
        rentPriceMC[i] = gbm_pirce.map(value => value * this.rentPrice);

        // salaryMC[i] = s.GBM(this.salary, this.boomExpected_salary, this.boomVolatility_salary, range, range, true);
        // expensesMC[i] = s.GBM(this.expenses, this.boomExpected_price, this.boomVolatility_price, range, range, true);
        // rentPriceMC[i] = s.GBM(this.rentPrice, this.boomExpected_price, this.boomVolatility_price, range, range, true);
        // 景气 mu=0, sigma=0.1
        // 失落 mu=-0.001, sigma=0.001
        // M 如下
        // salaryMC[i] = s.GBM(this.salary, 0.001, 0.001, range, range, true);
        // expensesMC[i] = s.GBM(this.expenses, 0.005, 0.1, range, range, true);
        // rentPriceMC[i] = s.GBM(this.rentPrice, 0.005, 0.1, range, range, true);

        // 計算總表 resultMC
        var result = [];
        var saving = this.capital;
        for (var j = 1; j <= range; j++){
          if (saving > 0){
            saving *= ROI;
          }else{
            saving *= ROI; // 改利率
          }
          result[j] = (salaryMC[i][j] - rentPriceMC[i][j] - expensesMC[i][j]) + saving;
          saving = result[j];
        }
        resultMC[i] = result.slice(1, );
        
        // sum
        resultSum = resultSum.map((amount, idx) => amount + resultMC[i][idx]);
      }

      // avg
      var resultAvg = resultSum.map(x => x / MCnumber);

      var resultLast = resultMC.map(x => x[range - 1]);

      console.log(resultMC);
      console.log(resultLast);
      console.log(resultAvg);

      this.result = resultAvg[range - 1];
      this.resultStd = math.std(resultLast);
      this.resultMax = math.max(resultLast);
      this.resultMin = math.min(resultLast);
      // test.test()
      
    },
    clear () {
      this.$refs.form.reset();
    }
  }
}
</script>


