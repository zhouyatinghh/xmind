<template>
  <div class="hello">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择月"
        value-format="timestamp"
        @change="handleChange"
        >
        </el-date-picker>
      </el-col>
  
      <el-col :span="3">
         <el-button type="primary" size="small" @click="dialogVisible = true">添加账单</el-button>
      </el-col>
    </el-row>
    <el-row class="margin"> 
      <div class="default-table">
        <el-table :data="tableList" border stripe class="table-border" fit>
          <el-table-column label="账单时间" align="center">
            <template slot-scope="scope">
              {{ scope.row.time | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账单类型" align="center" >
            <template slot-scope="scope">
              {{ scope.row.type === 0? "支出":"收入" }}
            </template>
          </el-table-column>
          <el-table-column label="账单分类"  align="center">
            <template slot-scope="scope">
              {{ scope.row.category | billtypeFilter }}
            </template>
          </el-table-column>
          <el-table-column label="账单金额" prop="amount" align="center" />
        </el-table>
      </div>
    </el-row>
    <template v-if="month">
      <el-row class="margin">
        <el-col :span="5">
          <span>月支出：{{ totalMonthOut }}</span>
        </el-col>
        <el-col :span="5">
          <span>月收入：{{ totalMonthIn }}</span>
        </el-col>
      </el-row>
    </template>
    <el-row>
      <el-dialog
        title="添加新账单"
        :visible.sync="dialogVisible"
        width="500px"
        >
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="账单类型">
            <el-select v-model="form.type" placeholder="请选择账单类型">
              <el-option label="收入" :value="1"></el-option>
              <el-option label="支出" :value="0"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="账单分类">
            <el-select v-model="form.category" placeholder="请选择账单分类">
              <el-option v-for="item in billTypes" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账单创建时间">
              <el-date-picker
                v-model="form.time"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="账单金额">
            <div>
            <el-input v-model="form.amount" placeholder="请输入账单金额" @input="handleAmount" type="number"></el-input>
            </div>
          </el-form-item>
      </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm()">确 定</el-button>
          </span>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import {bills,billTypes} from "@/utils/env";
import {formatDate,formatDateSameMonth} from "@/utils/mutils";
export default {
  name: 'HelloWorld',
  filters:{
    formatDate,
    billtypeFilter(val) {
      return billTypes.find((item) => item.id === val).name;
    }
  },
  data () {
    return {
      tableList:[],
      month:"",
      totalMonthIn:0,
      totalMonthOut:0,
      dialogVisible:false,
      billTypes,
      bills,
      form:{

      }
    }
  },
  created(){
    this.tableList = this.bills;
  },
  methods:{
    handleChange(){
      if(this.month){
        this.tableList = formatDateSameMonth(this.tableList,this.month);
        let monthOut = this.tableList.filter((item) => item.type === 0)
        let monthIn = this.tableList.filter((item) => item.type === 1)
        this.totalMonthIn = 0
        this.totalMonthOut = 0
        monthIn.forEach(res => {
          this.totalMonthIn = this.totalMonthIn + parseFloat(res.amount)
        })
        monthOut.forEach(res => {
          this.totalMonthOut =this.totalMonthOut+  parseFloat(res.amount)
        })
      }else {
        this.tableList = this.bills
      }
   },
   handleConfirm(){
     this.bills.push({
       type:this.form.type,
       time:this.form.time.getTime(),
       category:this.form.category,
       amount:this.form.amount
     })
     this.dialogVisible = false;
     this.form = {}
   },
   handleAmount(e){
    this.form.amount = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null
   }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.margin{
  margin-top:30px;
}
</style>
