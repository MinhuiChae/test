<template>
  <div class = "content">
    <form ref = 'el'>
      <h1 v-if="updateModal === true" >UserUpdate</h1>
      <h1 v-if="addModal === true" >UserAdd</h1>
     <table>
        <tr>
          <!-- <td v-if="updateModal === true">id: <input type="data.inputumber" name="id" :value = 'props.selectedData?.id' readonly></td>
          <td v-if="addModal === true">id: <input type="number" name="id" :value = 'props.selectedData?.id' min="1"></td>
          <td>name:<input type="text" name="name" :value = 'props.selectedData?.name' > </td>
          <td>age: <input type="number" name="age" :value = 'props.selectedData?.age' min="1"></td>
          <td>gender: 
            <select name="gender" :value = 'props.selectedData?.gender'>
              <option>female</option>
              <option>male</option>
            </select></td> -->
          <!-- <td v-for="(inputMenu, i) in inputList.inputName" :key="i">{{inputList.inputName[i]}}: 
          <input type="text" :value = 'inputList.inputValue[i]' :name="inputList.inputName[i]"></td>
          <td v-for="(inputMenu, i) in inputList.selectName" :key="i"> {{inputList.selectName[i]}}:
          <select :name="inputList.selectName[i]" :value = 'inputList.selectValue[i]'>
              <option>female</option>
              <option>male</option>
            </select></td> -->
            <td v-for ="input in inputList" :key = "input.name">
              {{ input.name }} <input :type = "input.inputType"> 
            </td>
        </tr>
      </table>
    </form>    
  </div>
  <div>
    <button class="btn btn-primary" @click.stop="changeUser" > {{ buttonName() }} </button>
  </div>
</template>
<script lang="ts">
/**
 * Data => View.....  view => Data ....................................
 * label : id, input: number, value. props.selelctid , ...
 * label : name , input: text , value : props.selelctdata.name 
 * 비고...
 * <lable 비고. inpt: text . vlualesdf.asdf
 */
import { defineComponent, PropType, ref } from 'vue'
import { IUserData } from '@/interface';
import useObject from '@/composition/useObject';
import { THTMLElement } from '@/types';

export default defineComponent({
    name: "Content-Popup",
    emits: ["changeData", "checkFormList"],
    props: {
        selectedData: {
          type: Object as PropType<IUserData>
        },
        updateModal: {
          type: Boolean
        },
        addModal: {
          type: Boolean
        }
    },
    setup(props, context) {
        const el = ref<HTMLFormElement>();
        const changeIUserData: IUserData = Object.assign({}, props.selectedData);
        const { setProperty, getElementValue } = useObject();
        // const inputList2 = {
        //   inputName:['id', 'name', 'age'],
        //   selectName:['gender'],
        //   inputValue: [props.selectedData?.id, props.selectedData?.name, props.selectedData?.age ],
        //   selectValue:[props.selectedData?.gender],
        //   inputType:['number', 'text'],
        // }

        const inputList = [
          {
            name: 'id',
            value: props.selectedData?.id,
            inputType: 'text',
          },
           {
            name: 'name',
            value: props.selectedData?.id,
            inputType: 'text',
          }, {
            name: 'age',
            value: props.selectedData?.id,
            inputType: 'number',
          }

        ]

        let checkFormList: string[] = [];
        const changeUser = () => {
          const elements = el.value?.elements;
          if (elements) {
            [...elements].forEach(element => {
              const key = element.getAttribute("name");
              let value: string | number = getElementValue(element as THTMLElement);
              if (typeof changeIUserData[key as keyof IUserData] === "number") {
                value = parseInt(value as string);
              }
              if (key) {
                checkForm(key, value);
              }
               console.log(key)
               console.log(value)
            });
          }
          if (checkFormList.length === 0) {
            context.emit("changeData", changeIUserData);
          }
          else {
            context.emit("checkFormList", checkFormList);
          }
          checkFormList.length = 0;
         
        };
        const checkForm = (key: string, value: any) => {
            if (!value) {
              checkFormList.push(key);
            } else {
              setProperty(changeIUserData, key as keyof IUserData, value);
            }
        };
        const buttonName = (): string => {
          if(props.updateModal === true) {
            return 'update';
          } else if(props.addModal === true) {
            return 'add';
          } return '';
        }

        const checkInputType = (inputName: string) => {
          console.log(1)
          if(inputName === 'id' || inputName === 'age') {
            return 'number';
          } else {
            return 'text';
          }
        }

        return {
          props,
          changeUser,
          el,
          buttonName,
          inputList,
          checkInputType
        };
    }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  width:100% !important;
}
</style>
