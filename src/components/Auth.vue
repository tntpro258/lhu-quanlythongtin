<template>
    <div class="auth-container">
      <h2>Đăng nhập / Đăng ký</h2>
  
      <form @submit.prevent="isLogin ? login() : register()">
        <div>
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
  
        <div>
          <label for="password">Mật khẩu:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
  
        <button type="submit">{{ isLogin ? "Đăng nhập" : "Đăng ký" }}</button>
      </form>
  
      <p>
        {{ isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?" }}
        <span @click="toggleAuthMode">
          {{ isLogin ? "Đăng ký ngay" : "Đăng nhập" }}
        </span>
      </p>
  
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import { auth } from "../firebase";
  import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
  
  export default {
    name: "Auth",
    data() {
      return {
        email: "",
        password: "",
        isLogin: true, // true: login, false: register
        error: null,
      };
    },
    methods: {
      async register() {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          console.log("User registered:", userCredential.user);
          alert("Đăng ký thành công!");
        } catch (err) {
          this.error = err.message;
        }
      },
      async login() {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
          console.log("User logged in:", userCredential.user);
          alert("Đăng nhập thành công!");
        } catch (err) {
          this.error = err.message;
        }
      },
      toggleAuthMode() {
        this.isLogin = !this.isLogin;
        this.error = null;
      },
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    width: 300px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #f9f9f9;
  }
  
  form div {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  </style>
  