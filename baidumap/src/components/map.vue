<template>
  <div class="componentDiv"  v-loading.fullscreen.lock="fullscreenLoading">
    <el-row style="height: 100%">
      <el-col :span="4" style="height: 100%">
        <el-form ref="form" :model="form" label-width="80px" style="margin: 30px 10px 0">
          <el-form-item label="公司名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="药物大类" prop="dugClass">
            <el-select v-model="form.dugClass" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option label="生物药" value="生物药"></el-option>
              <el-option label="化药" value="化药"></el-option>
              <el-option label="生物药/化药" value="生物药/化药"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="具体类型" prop="classInfo">
            <el-select v-model="form.classInfo" multiple placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in classInfoArr" :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司规模" prop="size">
            <el-select v-model="form.size" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option label="50人以下" value="50人以下"></el-option>
              <el-option label="50~100人" value="50~100人"></el-option>
              <el-option label="100~500人" value="100~500人"></el-option>
              <el-option label="500~1000人" value="500~1000人"></el-option>
              <el-option label="1000人以上" value="1000人以上"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司性质" prop="nature">
            <el-select v-model="form.nature" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option v-for="item in natureArr" :key="item"
                         :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上市" prop="inMarket">
            <el-select v-model="form.inMarket" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在省" prop="province">
            <el-select v-model="form.province" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option label="江苏省" value="江苏省"></el-option>
              <el-option label="浙江省" value="浙江省"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="所在市" prop="city">
            <el-select v-model="form.city" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option label="南京市" value="南京市"></el-option>
              <el-option label="苏州市" value="苏州市"></el-option>
              <el-option label="泰州市" value="泰州市"></el-option>
              <el-option label="杭州市" value="杭州市"></el-option>
              <el-option label="上海市" value="上海市"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产规模" prop="productionSize">
            <el-select v-model="form.productionSize" placeholder="请选择" style="width: 100%">
              <el-option label="请选择" value=""></el-option>
              <el-option label="50L-100L" value="50L-100L"></el-option>
              <el-option label="100L-500L" value="100L-500L"></el-option>
              <el-option label="500L-2000L" value="500L-2000L"></el-option>
              <el-option label="2000L-10000L" value="2000L-10000L"></el-option>
              <el-option label="10000L以上" value="10000L以上"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetData()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20" style="height: 100%">
        <baidu-map
            id="map"
            class="mapStyle"
            :center="centerPoint"
            :zoom="9"
            :scroll-wheel-zoom="true"
            @ready="handler">
        </baidu-map>
      </el-col>
    </el-row>
      <!-- ready,地图组件渲染完毕时触发，返回一个百度地图的核心类和地图实例 -->

  </div>
</template>

<script>
import XLSX from "xlsx"
const classInfoArr=['抗体','重组蛋白','细胞治疗', '基因治疗','ADC','RDC','mRNA',' 干细胞','多肽','疫苗','激素、细胞因子','血液制品','其他生物药','化学药物','非药物','其他信息']
const natureArr=['CRO','CDMO','耗材商', '仪器商','自研药','其他第三方','CDMO+自研药']
export default {
  // components:{BaiduMap},
  data() {
    return {
      fullscreenLoading:true,
      form:{
        name:'',
        size:'',
        nature:'',
        dugClass:'',
        classInfo:'',
        productionSize:'',
        inMarket:'',
        province:'',
        city:''
      },
      classInfoArr,
      natureArr,
      mapData:[],
      BMap:null,
      map:null,
      //中心轴坐标
      centerPoint: {
        lng: 116.404,
        lat: 39.915,
      },
      markerArr: [],
      allData:[],
      markerPoint: {},
      content: '',    //初始化数据
      err: '',
      xlsxJson: {},
      importHeader:["shortName","name","size","nature","inMarket","dugClass", "classInfo","hasDevTeam",
        "hasPoisonTeam","hasCMCTeam","hasClinicTeam","hasCommercialProd","hasPreparationLine","productionSize",
        "province","city","adress",'otherInfo'],
      expectData:[]
    };
  },
  methods: {
    // 完成一次组件卸载 / 重新加载的方法，重新渲染
    handler({BMap, map}) {
      let _this=this;
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){
        _this.BMap = BMap
        _this.map = map
        _this.centerPoint.lng = r.point.lng ;
        _this.centerPoint.lat = r.point.lat;
        _this.getForExcel()
      });
    },
    getForExcel(){
      let url = "/task_list.xlsx"  //放在public目录下的文件可以直接访问

      //读取二进制excel文件,参考https://github.com/SheetJS/js-xlsx#utility-functions
      this.$http.get(url, {responseType:'arraybuffer'})
          .then((res) => {
            let data = new Uint8Array(res.data)
            let wb = XLSX.read(data, {type:"array"})
            let result = [];
            //SheetNames包含了文件中所有的表明
            wb.SheetNames.forEach((sheetName) => {
              result.push({
                sheetName: sheetName,
                sheet: XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
                  //header是设置表属性名，如果设置为数字，则属性名由0，1，2...表示
                  //此处设置的header为importHeader:["姓名","年龄"],最终结果的属性名对应该数组
                  header: this.importHeader,defval:''
                }),
              });
            });
            console.log(result)
            //将excel文件第一张表的第一项(excel的第一行为属性名，应该去掉)删除
            result[0].sheet.shift();
            this.setLedgerList(result);
          }).catch( err =>{
        this.err = err
      })
    },
    setLedgerList(result) {
      result[0].sheet.forEach((item) => {
        this.mapData.push(item);
      });
      this.allData=[...this.mapData]
      this.handleDataPoint()
    },
    handleDataPoint(){
      let _this=this;
      let BMap = this.BMap;
      let map = this.map;
      let myGeo =new BMap.Geocoder();
      let allOverlay = map.getOverlays();
      let len=allOverlay.length
      for (let i = 0; i < len; i++){
        if(this.expectData.some(item=>{return item.name===allOverlay[i].markName})){
          map.removeOverlay(allOverlay[i]);
        }
      }
      if(_this.mapData.length===0){
        this.$message.error('没有匹配数据');
        this.fullscreenLoading=false;
        return
      }
      for(let i=0;i<_this.mapData.length;i++){
        //将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(_this.mapData[i].adress, function(point){
          if(point){
            // map.centerAndZoom(point, 10);
            let marker = new BMap.Marker(point, {title: _this.mapData[i].name});
            marker.markName=_this.mapData[i].name
            map.addOverlay(marker);
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            //添加监听事件
            (function() {
              marker.addEventListener("mouseover",
                  function() {
                    _this.showInfo(this,_this.mapData[i]);
                  });
              marker.addEventListener("mouseout",
                  function() {
                    this.closeInfoWindow();
                  });
            })();
          }else{
            alert('您选择的地址没有解析到结果！');
          }
        })
      }
      this.fullscreenLoading=false
    },
    showInfo(thisMarker,data) {
      let BMap = this.BMap;
      //获取点的信息
      let sContent =
          '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
          +'<li style="line-height: 26px;font-size: 15px;"><span style="display: inline-block;">名称：</span>' + data.name+ '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span class="labelSty">简称：' + data.shortName +'</span><span class="infoSpan">公司规模：</span>' + data.size+ '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span class="labelSty">公司性质：' + data.nature + '</span><span class="infoSpan">是否上市：</span>' + data.inMarket + '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span class="labelSty">药物大类：' + data.dugClass + '</span><span class="infoSpan">具体类型：</span>' + data.classInfo + '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span class="labelSty">早期研发团队：' + data.hasDevTeam + '</span><span class="infoSpan">药理毒理团队：</span>' + data.hasPoisonTeam + '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span class="labelSty">CMC团队：' + data.hasCMCTeam + '</span><span class="infoSpan">临床团队：</span>' + data.hasClinicTeam + '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span class="labelSty">商业化生产：' + data.hasCommercialProd + '</span><span class="infoSpan">制剂灌装线：</span>' + data.hasPreparationLine + '</li>'
          +'<li style="line-height: 26px;font-size: 15px;"><span>生产规模：</span>' + data.productionSize + '</li>'
          +'<li style="line-height: 26px;font-size: 15px;max-width: 550px;"><span style="display: inline-block;">地址：</span>'+data.adress+'</li>'
          +'</ul>';
      let infoWindow = new BMap.InfoWindow(sContent); //创建信息窗口对象
      thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
    },
    onSubmit(){
      this.fullscreenLoading=true;
      this.expectData=[];
      this.mapData=[...this.allData];
      for(let key in this.form){
        if(this.form[key]!==''){
          this.filterData(key,this.form[key])
        }
      }
      this.handleDataPoint()
    },
    filterData(key,data){
      if(key ==='classInfo'){
        if(data.length>0) {
          let classInfoArr = []
          this.mapData.forEach(mapItem => {
            if (data.every(item=>{return mapItem[key].includes(item)})) {
              classInfoArr.push(mapItem)
            }
            else {
              this.expectData.push(mapItem)
            }
          })
          this.mapData = classInfoArr;
        }
      }else {
        this.mapData = this.mapData.filter(item => {
          if (key === 'name' || key === 'dugClass') {
            if(!item[key].includes(data)) {
              this.expectData.push(item)
            }
            return item[key].includes(data)
          } else {
            if(item[key] !== data) {
              this.expectData.push(item)
            }
            return item[key] === data
          }
        })
      }
    },
    resetData(){
      this.fullscreenLoading=true;
      this.$refs.form.resetFields();
      this.mapData = [...this.allData];
      this.expectData=[];
      this.handleDataPoint()
    }
  },
};
</script>

<style scoped>
.mapStyle {
  width: 100%;
  height: 100%;
}
.componentDiv{
  height: 100%;
}
</style>
<style>
.infoSpan{
  display: inline-block;
  margin-left: 70px;
}
.labelSty{
  display: inline-block;
  width: 150px;
}
</style>
