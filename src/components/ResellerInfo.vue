<template>
  <div class="form-warpper">
    <h1>merchant Info</h1>
    <el-form label-position="right" :model="formData" label-width="120px" :disabled="false" ref="form">
      <el-form-item label="ID">
        <el-input disabled v-model="formData.id"></el-input>
      </el-form-item>
      <el-form-item label="Registration time">
        <el-input disabled v-model="formData.createTime"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input disabled v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input disabled v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true" size="small">Modify the password</el-button>
        <el-button @click="back" size="small">Back</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="Modify the password" :visible.sync="dialogVisible" width="50%" center :before-close="beforeDialogClose">
      <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="140px" class="demo-ruleForm">
        <el-form-item label="Old Password" prop="oldPass">
          <el-input type="password" v-model.number="ruleForm2.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="pass">
          <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Repeat Password" prop="checkPass">
          <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm2')">Modify</el-button>
          <el-button @click="resetForm('ruleForm2')">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import router from '../router'
import Qs from 'qs'
import { isPassword } from '../utils'
export default {
  name: 'ResellerInfo',
  data () {
    const checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Please enter the old password'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter a new password'))
      } else if (!isPassword(value)) {
        return callback(new Error('A password is a combination of 6 to 18 letters, or numbers, or underlines.'))
      } else {
        if (this.ruleForm2.checkPass !== '') {
          this.$refs.ruleForm2.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter the password again'))
      } else if (!isPassword(value)) {
        return callback(new Error('A password is a combination of 6 to 18 letters, or numbers, or underlines.'))
      } else if (value !== this.ruleForm2.pass) {
        callback(new Error('Two input password inconsistencies'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      formData: {
        id: '',
        createTime: '',
        email: '',
        password: ''
      },
      ruleForm2: {
        oldPass: '',
        pass: '',
        checkPass: ''
      },
      rules2: {
        oldPass: [
          { validator: checkOldPass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getDetails()
  },
  methods: {
    back () {
      router.go(-1)
    },
    beforeDialogClose (done) {
      this.$refs['ruleForm2'].resetFields()
      done()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = new FormData()
          formData.append('id', this.formData.id)
          formData.append('email', this.formData.email)
          formData.append('password', this.ruleForm2.oldPass)
          formData.append('new_password', this.ruleForm2.pass)
          this.$axios.put('/manager', formData).then(res => {
            console.log(res)
            if (parseInt(res.data.code) === 200) {
              this.$alert('Revise the password successfully, please log in again', 'Info', {
                confirmButtonText: 'OK',
                callback: action => {
                  router.push({name: 'Login'})
                }
              })
            } else {
              this.$message.error('Amend a error')
            }
          }).catch((e) => {
            this.$message.error('Network connection error')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getDetails () {
      let userInfo = Qs.parse(window.localStorage.getItem('userInfo'))
      this.formData.id = userInfo.id
      if (userInfo.createTime) {
        this.formData.createTime = new Date(parseInt(userInfo.createTime) * 1000).toString()
      } else {
        this.formData.createTime = ''
      }
      this.formData.email = userInfo.name
      this.formData.password = userInfo.password
    }
  }
}
</script>
<style lang="scss" scoped>
  .form-warpper{
    width: 600px;
    h1{
      margin-bottom: 30px;
    }
  }
</style>
