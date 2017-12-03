<template>
  <div>
    <!-- <div class="container">
	    <div class="row">
        <div class="col-md-6">
            <div id="custom-search-input">
                <div class="input-group col-md-12">
                    <input v-model="search" type="text" class="form-control input-lg" placeholder="Search..." />
                    <span class="input-group-btn">
                        <button class="btn btn-info btn-lg" type="button">
                            <i class="glyphicon glyphicon-search"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
	    </div>
    </div>
    <hr> -->
    <!-- <input v-model="search" type="text" name="search" placeholder="Search..."/> -->
    <vue-good-table
      :columns="columns"
      :rows="filterData"
      :paginate="true"
      :lineNumbers="true"
      :globalSearch="true"
      :onClick="onClickFn"/>

    <!-- <vue-good-table
      :columns="columns"
      :rows="switchs"
      :lineNumbers="false"
      :paginate="true"
      :globalSearch="true"
      styleClass="table table-bordered table-striped">
      <template slot="table-row" scope="props">
        <td class="fancy" @click="test" style="cursor:pointer" >{{ props.row.name }}</td>
        <td class="fancy" style="cursor:pointer">{{ props.row.uptime }}</td>
        <td class="fancy" style="cursor:pointer">{{ props.row.uptime }}</td>
      </template>
      </vue-good-table> -->

      <!-- <table class="table table-hover">
        <thead>
          <tr>
            <th>Switch Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody> 
          <tr v-for="m in filterData"
          :key="m" 
          :clickable="true" 
          style="cursor:pointer" 
          @click="test(event)">
            <td :clickable="true">
            <p>{{m.name}}</p>
            </td>
            <td>Up - {{m.uptime}} Days</td>
          </tr>
        </tbody>
      </table> -->
  </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      search: "",
      columns: [
        {
          label: "Name",
          field: "name",
          filterable: false
        },
        {
          label: "Status",
          field: "uptime",
          type: "number",
          html: false,
          filterable: false
        },
        {
          label: "Uptime",
          field: "uptime",
          type: "number",
          html: false,
          filterable: false
        }
      ],
      onClickFn: function(row, index){
      console.log(row.name); //the object for the row that was clicked on
      console.log(row.position)
      },
      eiei: "",
      switchs: []
    };
  },
  methods: {
    getSwitch() {
      this.axios
        .get("https://fibermap.herokuapp.com/getswitch")
        .then(response => {
          // console.log(response.data);
          this.switchs = response.data;
        });
    },
    test(e) {
      console.log(this.e.name);
    }
  },
  created() {
    this.getSwitch();
  },
  computed: {
    filterData() {
      return this.switchs.filter(sw => {
        return sw.name.match(this.search);
      });
    }
  }
};
</script>

<style>
#custom-search-input {
  padding: 3px;
  border: solid 1px #e4e4e4;
  border-radius: 6px;
  background-color: #fff;
}

#custom-search-input input {
  border: 0;
  box-shadow: none;
}

#custom-search-input button {
  margin: 2px 0 0 0;
  background: none;
  box-shadow: none;
  border: 0;
  color: #666666;
  padding: 0 8px 0 10px;
  border-left: solid 1px #ccc;
}

#custom-search-input button:hover {
  border: 0;
  box-shadow: none;
  border-left: solid 1px #ccc;
}

#custom-search-input .glyphicon-search {
  font-size: 23px;
}
#custom-search-input {
  width: 82%;
}
</style>
