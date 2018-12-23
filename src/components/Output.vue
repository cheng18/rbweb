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
            v-model="investment"
            label="投資"
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
            v-model="boomVolatility"
            label="景氣波動率"
            required
          ></v-text-field>
          <v-text-field
            v-model="boomExpected"
            label="期望值"
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
        <p>結果：{{result}}</p>
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
        investment: 3000000,
        ROI: 2.5,
        rentPrice: 143040,
        housePrice: 5100000,
        space: null,
        area: null,
        boomVolatility: 0.1,
        boomExpected: 0,
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
      var resultAvg = new Array(range);
      var ROI = this.ROI * 0.01 + 1;

      resultAvg.fill(0, 0, range);

      for (var i = 0; i < MCnumber; i++) {
        // 計算各表之幾何布朗運動
        salaryMC[i] = s.GBM(this.salary, this.boomExpected, this.boomVolatility, range, range, true);
        expensesMC[i] = s.GBM(this.expenses, this.boomExpected, this.boomVolatility, range, range, true);
        rentPriceMC[i] = s.GBM(this.rentPrice, this.boomExpected, this.boomVolatility, range, range, true);
        // 景气 mu=0, sigma=0.1
        // 失落 mu=-0.001, sigma=0.001
        // M 如下
        // salaryMC[i] = s.GBM(this.salary, 0.001, 0.001, range, range, true);
        // expensesMC[i] = s.GBM(this.expenses, 0.005, 0.1, range, range, true);
        // rentPriceMC[i] = s.GBM(this.rentPrice, 0.005, 0.1, range, range, true);

        // 計算總表 resultMC
        var result = [];
        result[1] = (salaryMC[i][1] - rentPriceMC[i][1] - expensesMC[i][1]) + this.capital * ROI;
        for (var j = 2; j <= range; j++){
          var saving = result[j - 1] * ROI;
          result[j] = (salaryMC[i][j] - rentPriceMC[i][j] - expensesMC[i][j]) + saving;
        }
        resultMC[i] = result.slice(1, );
        
        // sum
        resultAvg = resultAvg.map((amount, idx) => amount + resultMC[i][idx]);
      }

      // avg
      resultAvg = resultAvg.map(x => x / MCnumber);

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


