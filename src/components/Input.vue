<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        
        <v-form ref="form" lazy-validation>
          <v-text-field
            v-model="salary"
            label="年薪資"
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
            v-model="space"
            label="居住坪數"
            required
          ></v-text-field>
          <v-text-field
            v-model="area"
            label="居住區域"
            required
          ></v-text-field>
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

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'Input',
  props: {
  },
  data: () => ({
    salary: null,
    capital: null,
    expenses: null,
    investment: null,
    space: null,
    area: null,
    boomVolatility: null,
    boomExpected: null
  }),
  methods: {
    submit () {
      // console.log('a');
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>


