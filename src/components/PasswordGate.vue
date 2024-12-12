<!-- src/components/PasswordGate.vue -->
<template>
  <div>
    <h2>Enter Password</h2>
    <input
      type="password"
      v-model="password"
      @keyup.enter="submit"
      placeholder="Enter your password"
    />
    <button @click="submit">Submit</button>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'PasswordGate',
  data() {
    return {
      password: '',
      correctPassword: 'mySecretPassword', // Replace this with your chosen password
      error: '',
    };
  },
  methods: {
    submit() {
      if (this.password === this.correctPassword) {
        this.$emit('authenticated'); // Emits an event to parent component (App.vue)
      } else {
        this.error = 'Incorrect password. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
input {
  margin: 5px 0;
  padding: 5px;
}
button {
  padding: 5px 10px;
  margin-left: 5px;
}
</style>
