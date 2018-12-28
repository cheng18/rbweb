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
            label="凈儲蓄或負載"
            required
            type="number"
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
            v-model="boomExpected_salary"
            label="所得-期望值"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomVolatility_salary"
            label="所得-景氣波動率"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomExpected_price"
            label="物價-期望值"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomVolatility_price"
            label="物價-景氣波動率"
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
      var mu_salary = this.boomExpected_salary;
      var sigma_salary = this.boomVolatility_salary;
      var mu_price = this.boomExpected_price;
      var sigma_price = this.boomVolatility_price;

      resultSum.fill(0, 0, range);

      for (var i = 0; i < MCnumber; i++) {
        // 景气 mu=0, sigma=0.1
        // 失落 mu=-0.001, sigma=0.001
        // M 如下 salary: mu=0.001, sigma=0.001 price: mu=0.005, sigma=0.1

        // 計算各表之幾何布朗運動
        var gbm_salary = s.GBM(1, mu_salary, sigma_salary, range, range, true);
        var gbm_pirce = s.GBM(1, mu_price, sigma_price, range, range, true);
        // var gbm_test = s.GBM(1, mu_price, sigma_price, range, range, true);

        salaryMC[i] = gbm_salary.map(value => value * this.salary);
        expensesMC[i] = gbm_pirce.map(value => value * this.expenses);
        rentPriceMC[i] = gbm_pirce.map(value => value * this.rentPrice);

        // 計算總表 resultMC
        var result = [];
        var saving = Number(this.capital);
        for (var t = 1; t <= range; t++){
          // if (saving > 0){
          //   saving *= ROI;
          // }else{
          //   saving *= ROI; // 改利率
          // }
          result[t] = (salaryMC[i][t] - rentPriceMC[i][t] - expensesMC[i][t]) + saving;
          // result[j] = salaryMC[i][j];
          saving = result[t];
        }
        resultMC[i] = result.slice(1, );
        
        // sum
        resultSum = resultSum.map((amount, idx) => amount + resultMC[i][idx]);
      }

      // avg
      var resultAvg = resultSum.map(x => x / MCnumber);
      // 取最後一年的一千次結果
      var resultLast = resultMC.map(x => x[range - 1]);

      this.result = resultAvg[range - 1];
      this.resultStd = math.std(resultLast);
      this.resultMax = math.max(resultLast);
      this.resultMin = math.min(resultLast);

      console.log(resultMC);
      console.log(resultLast);
      console.log(resultAvg);

      // test.test()

      // test stn plus
      var var_result = [];
      var var_saving = 0;
      for (var t = 1; t <= range; t++){
        // if (var_saving > 0){
        //   var_saving *= 1//ROI;
        // }else{
        //   var_saving *= 1//ROI; // 改利率
        // }
        var var_salary = Math.pow(this.salary, 2) * Math.exp(2 * mu_salary * t) * (Math.exp(Math.pow(sigma_salary, 2) * t) - 1);
        var var_expenses = Math.pow(this.expenses, 2) * Math.exp(2 * mu_price * t) * (Math.exp(Math.pow(sigma_price, 2) * t) - 1);
        var var_rentPrice = Math.pow(this.rentPrice, 2) * Math.exp(2 * mu_price * t) * (Math.exp(Math.pow(sigma_price, 2) * t) - 1);
        var_result[t] = (var_salary + var_expenses + var_rentPrice) + var_saving;
        var_saving = var_result[t];
      }
      console.log(var_result);
      console.log('var: ' + var_result.slice(-1, ));
      console.log('stn: ' + Math.sqrt(var_result.slice(-1, )));
      console.log('stn/stn: ' + Math.sqrt(var_result.slice(-1, )) / this.resultStd);


      // var stn_salary = Math.pow(this.salary, 2) * Math.exp(2 * this.boomExpected_salary * 35) * (Math.exp(Math.pow(this.boomVolatility_salary, 2) * 35) - 1);
      // console.log(stn_salary);
    },
    clear () {
      this.$refs.form.reset();
    }
  }
}
</script>


