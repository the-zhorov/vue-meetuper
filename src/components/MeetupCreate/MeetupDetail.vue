<template>
  <form @input="emitFormData">
    <div class="field">
      <label class="title m-b-sm">Choose Title</label>
      <input 
        @blur="$v.form.title.$touch()" 
        v-model="form.title" 
        class="input" 
        type="text" 
        placeholder="Enter Title">
      <div v-if="$v.form.title.$error">
        <span v-if="!$v.form.title.required" class="help is-danger">Title is required</span>
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">Start Date</label>
      <datepicker 
        :disabledDates="disabledDates"
        @input="setDate"
        :input-class="'input'"
        :placeholder="new Date | formatDate()"></datepicker>
      <div v-if="$v.form.startDate.$error">
        <span v-if="!$v.form.startDate.required" class="help is-danger">Starts at is required</span>
      </div>
    </div>
    <div class="field">
      <label class="title m-b-sm">From</label>
      <timepicker 
        :minute-interval="10"
        @change="changeTime($event, 'timeFrom')"></timepicker>
    </div>
    <div class="field">
      <label class="title m-b-sm">To</label>
      <timepicker 
        :minute-interval="10"
        @change="changeTime($event, 'timeTo')"></timepicker>
    </div>
    <div class="field">
      <label class="title m-b-sm">Please Choose the Category.</label>
      <div class="m-b-lg">
        <div class="select">
          <!-- TODO: Get Here Categories -->
          <select 
            v-model="form.category" 
            @blur="$v.form.category.$touch()" 
            @change="emitFormData">
            <option v-for="category of categories"
                    :value="category"
                    :key="category.id">{{category.name}}</option>
          </select>
        </div>
        <div v-if="$v.form.category.$error">
          <span v-if="!$v.form.category.required" class="help is-danger">Category is required</span>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import Timepicker from 'vue2-timepicker'
import { required } from "vuelidate/lib/validators"
import moment from 'moment'
export default {
  components: {Datepicker, Timepicker},
  data() {
    return {
      disabledDates: {
        customPredictor: function(date) {
          const today = new Date()
          today.setDate(today.getDate() - 1)
          return date < today
        }
      },
      form: {
        title: null,
        startDate: null,
        timeTo: null,
        timeFrom: null,
        category: null
      }
    };
  },
  validations: {
    form: {
      title: { required },
      startDate: { required },
      category: { required },
      timeTo: { required },
      timeFrom: { required }
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories.items
    }
  },
  methods: {
    emitFormData() {
      this.$emit('stepUpdated', {data: this.form, isValid: !this.$v.$invalid})
    },
    setDate(date) {
      this.form.startDate = moment(date).format()
      this.emitFormData()
    },
    changeTime({data}, field) {
      const hours = data.HH || '00'
      const minutes = data.mm || '00'
      this.form[field] = hours + ':' + minutes
      this.emitFormData()
    }
  }
};
</script>

<style scoped>
.time-picker {
  display: block;
}
</style>