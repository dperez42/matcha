<template>
  <v-container>
  <v-card 
              class="mx-auto"
              elevation="8"
              max-width="1000"
              min-width="280"
              rounded="lg"
              color="black" 
            >
    <v-row align="center" justify="center" >
  <v-col cols="12" sm="12">
    <v-card class="elevation-10 mt-1" color="black" >
                  <v-row>
                    <v-col cols="12" md="12">
                      <v-card-text class="mt-5" >
                        <v-row align="center" justify="center">
                          <v-card-title class="text-h5 font-weight-bold mx-auto pb-1">MY PROFILE</v-card-title>
                        </v-row>

      <!-- row of title --->
      <v-row align="center" justify="center">
          <v-col cols="12" sm="10">
            <v-form ref="form">

     <!-- pictures-->
        <v-row>
        <!-- avatar -->
          <v-col cols="12" md="6" align="center">
            <v-row align="center" justify="center">
              <v-col cols="auto" class="d-flex child-flex"> 
                <v-sheet
                  tabindex="0"                                
                  title="Click to grap a file from your PC!"
                  color="indigo lighten-4"
                  width="300"
                  height="300"
                  class="pa-1"
                >         
                <ImageDrop v-if ="enable" :imge="user_temp.avatar" @upload="imageLoadedAvatar"/>
                </v-sheet>
              </v-col>
            </v-row>
        <!-- rating -->
            <v-row align="center" justify="center">
              <v-col cols="auto" align="center">
                <v-rating
                  :length="5"
                  :size="32"
                  :model-value="parseInt(user_temp.rating/this.$RATING)"
                     active-color="yellow-darken-3"
                      color="orange-lighten-1"
                      readonly
                />
              </v-col>
            </v-row>
          </v-col>
        <!-- row input images -->
          <v-col cols="12" md="6" align="center" >
            <v-row align="center" justify="center">
              <v-col class="" cols="6">
                <v-sheet color="indigo lighten-4" class="pa-0 ma-0">
                  <ImageDrop v-if ="this.enable" :imge="user_temp.img1" @upload="imageLoadedImage1" /> 
                </v-sheet>  
              </v-col>
              <v-col class="" cols="6">
              <v-sheet color="indigo lighten-4" class="pa-0 ma-0">
                <ImageDrop v-if ="this.enable" :imge="user_temp.img2" @upload="imageLoadedImage2"/> 
              </v-sheet>  
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col class=""  cols="6">
              <v-sheet
                tabindex="0"                                
                title="Click to grap a file from your PC!"
                color="indigo lighten-4"
                class="pa-0"
              >
                <ImageDrop v-if ="this.enable" :imge="user_temp.img3" @upload="imageLoadedImage3"/> 
              </v-sheet>  
              </v-col>
              <v-col class="" cols="6">
              <v-sheet
                tabindex="0"                                
                title="Click to grap a file from your PC!"
                color="indigo lighten-4"
                class="pa-0"
              >
                <ImageDrop v-if="this.enable" :imge="user_temp.img4" @upload="imageLoadedImage4"/> 
              </v-sheet>  
              </v-col>
            </v-row>        
          </v-col>        
        </v-row>                               
      <!-- User info -->
        <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="user_temp.username"
                :rules="[v => !!v || 'Item is required']"
                label="Username"
                readonly
              ></v-text-field>  
            </v-col>
            <v-col cols="6" md="4">
              <v-text-field
                v-model="user_temp.first"
                :rules="[v => !!v || 'Item is required']"
                label="First Name"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />         
            </v-col>
            <v-col cols="6" md="5">
              <v-text-field
                v-model="user_temp.last"
                :rules="[v => !!v || 'Item is required']"
                label="Second Name"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />         
            </v-col>
        </v-row>
      <!-- Email, phone --> 
        <v-row>
            <v-col cols="6" md="5">
              <v-text-field
                v-model="user_temp.email"
                :rules="emailRules"
                label="Email"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />       
            </v-col>
            <v-col cols="6" md="4">
              <v-text-field
                v-model="user_temp.phone"
                ref="phone"
                :rules="[v => !!v || 'Item is required']"
                label="Phone"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />
            </v-col> 
            <v-col cols="12" md="3">
              Birthdate
              <VueDatePicker utc v-model="user_temp.date" :format="format" :enable-time-picker="false"></VueDatePicker>               
            </v-col>
        </v-row>

 <!-- Location -->
 <!-- address-->
        <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="user_temp.address"
                :rules="[v => !!v || 'Item is required']"
                label="Address"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />         
            </v-col>
        </v-row> 
<!-- city, state, zip, country-->
        <v-row>
            <v-col cols="6" md="4">
              <v-text-field
                v-model="user_temp.city"
                :rules="[v => !!v || 'Item is required']"
                label="City"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />       
            </v-col>
            <v-col cols="6" md="3">
              <v-text-field
                v-model="user_temp.state"
                :rules="[v => !!v || 'Item is required']"
                label="State"
                required
                outlined
                dense
                clearable
                color="blue"
                autocomplete="false"
                class=""
              />       
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model="user_temp.zip"
                :rules="this.zipCodeRules"
                label="Zip code"
                required
                outlined
                dense
                color="blue"
                autocomplete="false"
                class=""
              />
            </v-col> 
            <v-col cols="6" md="3">
              <v-select
                v-model="user_temp.country"
                :items="list_countries" 
                item-title="country"
                item-value="code"
                :rules="[v => !!v || 'Item is required']"
                label="Country"
                required
              ></v-select>                                   
            </v-col>
        </v-row>
<!-- Latitude and longitude -->
       <v-row>
            <v-col cols="6" md="6" >
              <v-text-field
                v-model="user_temp.latitude"
                :items="list_gender"
                :rules="[v => !!v || 'Item is required']"
                label="Latitud"
                required
              ></v-text-field>                                   
  
            </v-col>
            <v-col cols="6" md="6">
               <v-text-field
                  v-model="user_temp.longitude"
                  :rules="[v => !!v || 'Item is required']"
                  label="Longitud"
                  required
                  ></v-text-field>                                   
            </v-col>
      </v-row>

 <!-- Gender and sexual preferences -->
        <v-row>
            <v-col cols="6" md="6" >
              <v-select
                v-model="user_temp.gender"
                :items="list_gender"
                :rules="[v => !!v || 'Item is required']"
                label="Gender"
                required
              ></v-select>                                   
  
            </v-col>
            <v-col cols="6" md="6">
               <v-select
                  v-model="user_temp.sexual"
                  :items="list_sexual"
                  :rules="[v => !!v || 'Item is required']"
                  label="Sexual preferences"
                  required
                   ></v-select>                                   
            </v-col>
        </v-row>

 <!-- Interest -->
          <v-row>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="user_temp.bio"
                  :rules="[v => !!v || 'Item is required']"
                  label="Biography"
                  required
                  outlined
                  dense
                  color="blue"
                  autocomplete="false"
                  class=""
              />       
              </v-col>
              <v-col cols="12" md="12">
              <v-combobox
                v-model="my_tags"
                v-model:search="search"
                :hide-no-data="false"
                :items="list_tags"
                hint="Maximum of 5 tags"
                label="Add some tags"
                hide-selected
                multiple
                chips
                persistent-hint
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                    </v-list-item-title>
                  </v-list-item>
                </template>
              </v-combobox>           
              </v-col>
          </v-row> 

          </v-form>
                          </v-col>
                        </v-row>
          <!-- linea actions -->
            <v-row>
                            <v-col cols="12" md ="12">
                              <v-tooltip text="View Visit History" location="top">
                              <template v-slot:activator="{ props } "> 
                              <v-btn v-bind="props"
                                class="ma-2"
                                elevation="8"
                                color="info"
                                icon="mdi-view-list"
                                @click.prevent="toggleHistory()"
                                ></v-btn>
                              </template>
                              </v-tooltip>
                              <v-tooltip text="Reset" location="top">
                              <template v-slot:activator="{ props } "> 
                              <v-btn v-bind="props"
                                class="ma-2"
                                elevation="8"
                                color="info"
                                icon="mdi-reload"
                                @click.prevent="register_Reset()"
                                ></v-btn>
                              </template>
                              </v-tooltip>
                              <v-tooltip text="Update" location="top">
                              <template v-slot:activator="{ props } "> 
                              <v-btn v-bind="props"
                                color="info"
                                class="ma-2"
                                elevation="8"
                                icon="mdi-content-save"
                                @click.prevent="validate()"
                                >
                              </v-btn>
                              </template>
                              </v-tooltip>
                              <v-tooltip text="Exit" location="top">
                                <template v-slot:activator="{ props } ">
                              <v-btn v-bind="props"
                                elevation="8"
                                color="purple"
                                icon="mdi-location-exit"
                                @click.prevent="register_Quit"
                              ></v-btn>
                              </template>
                              </v-tooltip>
                            </v-col>
            </v-row>
          <!-- end-->
          </v-card-text>
          </v-col>
            </v-row>
            </v-card>
          </v-col>
    </v-row>
  </v-card>
  </v-container>
  <!--pop up history--->
  <div v-if="showHistoryModal === true" class="modal_mask_history">
    <div class="modal_body" ref="element_chat" id="chat_board">
      <div class="modal-header">
        <v-row  align="center" >
          <v-col cols="8" sm="10" class="text-h4 text-white">
            history
          </v-col>
          <v-col cols="4" sm="2">
            <v-btn size="x-small" elevation="8"
              class="ma-2"
              color="purple"
              icon="mdi-location-exit"
               @click.prevent="toggleHistory()"
            ></v-btn>
          </v-col>
        </v-row>
      </div>
      <div class="modal-body" >
        <History/>
      </div>
    </div>
  </div>
</template>


<script>
  import axios from "axios"
  import store from '../store/index'
  import ImageDrop from './subcomponents/ImageDrop.vue'
  import { toast } from 'vue3-toastify';
  import TagList from "./subcomponents/TagList.vue"
  import History from './subcomponents/History.vue'

  export default {
    components: {
      ImageDrop,
      TagList,
      History
  },
  data: () => ({
    list_tags: [],
    my_tags: [],
    search: null,
    select: null,
		error: false,
		error_message: "",
		info: false,
		info_message: "",
    enable:false,
		user_temp: "", //{ uuid:"7c65fda8-820d-4ed5-a68c-46d06308b0b7", username: "silverrabbit490", "password": "$2b$10$hd4lb17j6JNFEOepkDkYNe171plC0.5vMrXy6JqYSwEIDlydb9sei", "gender": "male", "sexual": "bisexual", "title": "Mr", "first": "Radovan", "last": "Mišković", "email": "radovan.miskovic@example.com", "bio": null, "rating": 3, "tags": null, "verificated": 0, "completed": 1, "address": "Lička,6791", "city": "Jadraque", "state": "Guadalajara", "zip": "99999", "country": "Spain", "nat": "RS", "longitude": "-2.91063493", "latitude": "40.92513589", "phone": "033-0593-492", "cell": "060-9971-285", "date": "1993-02-10T00:00:00.000Z", "registered": "2024-10-10T00:00:00.000Z", "avatar": "https://randomuser.me/api/portraits/men/48.jpg", "img1": "default.png", "img2": "default.png", "img3": "default.png", "img4": "default.png", "lastseen": "2024-10-16T21:47:15.000Z" },
    payload_avatar: null,
    payload_image1: null,
    payload_image2: null,
    payload_image3: null,
    payload_image4: null,
    showHistoryModal: false,
    list_title: ["Mr","Ms","Miss"],
		list_gender: ["Male", "Female"], //, "Transgender", "Cisgender", "Intersex","Genderfluid", "Non-binary gender", "Agender" ,"Bigender", "Demigender" ,"MTF" ,"Androgyne", "Genderbroken", "Two-spirit", "Gender identity disorder" ,"Aliagender" ,"Ambigender","Bisexual" ,"Butch", "Genderfae", "Genderflux", "Gendervoid", "Masculine gender", "Questioning"],
		list_sexual: ["Bisexual", "Heterosexual", "Homosexual"], //"Asexual" ,"Autosexual","Demisexual", "Gray-asexuality","Pansexual", "Queer", "Questioning" ],
    list_countries: [
       { code:"AF", country:"Afghanistan"},
       { code:"AX", country:"Aland Islands"},
       { code:"AL", country:"Albania"},
       { code:"DZ", country:"Algeria"},
       { code:"AS", country:"American Samoa"},
       { code:"AD", country:"Andorra"},
       { code:"AO", country:"Angola"},
       { code:"AI", country:"Anguilla"},
       { code:"AQ", country:"Antarctica"},
       { code:"AG", country:"Antigua And Barbuda"},
       { code:"AR", country:"Argentina"},
       { code:"AM", country:"Armenia"},
       { code:"AW", country:"Aruba"},
       { code:"AU", country:"Australia"},
       { code:"AT", country:"Austria"},
       { code:"AZ", country:"Azerbaijan"},
       { code:"BS", country:"Bahamas"},
       { code:"BH", country:"Bahrain"},
       { code:"BD", country:"Bangladesh"},
       { code:"BB", country:"Barbados"},
       { code:"BY", country:"Belarus"},
       { code:"BE", country:"Belgium"},
       { code:"BZ", country:"Belize"},
       { code:"BJ", country:"Benin"},
       { code:"BM", country:"Bermuda"},
       { code:"BT", country:"Bhutan"},
       { code:"BO", country:"Bolivia"},
       { code:"BA", country:"Bosnia And Herzegovina"},
       { code:"BW", country:"Botswana"},
       { code:"BV", country:"Bouvet Island"},
       { code:"BR", country:"Brazil"},
       { code:"IO", country:"British Indian Ocean Territory"},
       { code:"BN", country:"Brunei Darussalam"},
       { code:"BG", country:"Bulgaria"},
       { code:"BF", country:"Burkina Faso"},
       { code:"BI", country:"Burundi"},
       { code:"KH", country:"Cambodia"},
       { code:"CM", country:"Cameroon"},
       { code:"CA", country:"Canada"},
       { code:"CV", country:"Cape Verde"},
       { code:"KY", country:"Cayman Islands"},
       { code:"CF", country:"Central African Republic"},
       { code:"TD", country:"Chad"},
       { code:"CL", country:"Chile"},
       { code:"CN", country:"China"},
       { code:"CX", country:"Christmas Island"},
       { code:"CC", country:"Cocos (Keeling) Islands"},
       { code:"CO", country:"Colombia"},
       { code:"KM", country:"Comoros"},
       { code:"CG", country:"Congo"},
       { code:"CD", country:"Congo, Democratic Republic"},
       { code:"CK", country:"Cook Islands"},
       { code:"CR", country:"Costa Rica"},
       { code:"CI", country:"Cote D\"Ivoire"},
       { code:"HR", country:"Croatia"},
       { code:"CU", country:"Cuba"},
       { code:"CY", country:"Cyprus"},
       { code:"CZ", country:"Czech Republic"},
       { code:"DK", country:"Denmark"},
       { code:"DJ", country:"Djibouti"},
       { code:"DM", country:"Dominica"},
       { code:"DO", country:"Dominican Republic"},
       { code:"EC", country:"Ecuador"},
       { code:"EG", country:"Egypt"},
       { code:"SV", country:"El Salvador"},
       { code:"GQ", country:"Equatorial Guinea"},
       { code:"ER", country:"Eritrea"},
       { code:"EE", country:"Estonia"},
       { code:"ET", country:"Ethiopia"},
       { code:"FK", country:"Falkland Islands (Malvinas)"},
       { code:"FO", country:"Faroe Islands"},
       { code:"FJ", country:"Fiji"},
       { code:"FI", country:"Finland"},
       { code:"FR", country:"France"},
       { code:"GF", country:"French Guiana"},
       { code:"PF", country:"French Polynesia"},
       { code:"TF", country:"French Southern Territories"},
       { code:"GA", country:"Gabon"},
       { code:"GM", country:"Gambia"},
       { code:"GE", country:"Georgia"},
       { code:"DE", country:"Germany"},
       { code:"GH", country:"Ghana"},
       { code:"GI", country:"Gibraltar"},
       { code:"GR", country:"Greece"},
       { code:"GL", country:"Greenland"},
       { code:"GD", country:"Grenada"},
       { code:"GP", country:"Guadeloupe"},
       { code:"GU", country:"Guam"},
       { code:"GT", country:"Guatemala"},
       { code:"GG", country:"Guernsey"},
       { code:"GN", country:"Guinea"},
       { code:"GW", country:"Guinea-Bissau"},
       { code:"GY", country:"Guyana"},
       { code:"HT", country:"Haiti"},
       { code:"HM", country:"Heard Island & Mcdonald Islands"},
       { code:"VA", country:"Holy See (Vatican City State)"},
       { code:"HN", country:"Honduras"},
       { code:"HK", country:"Hong Kong"},
       { code:"HU", country:"Hungary"},
       { code:"IS", country:"Iceland"},
       { code:"IN", country:"India"},
       { code:"ID", country:"Indonesia"},
       { code:"IR", country:"Iran, Islamic Republic Of"},
       { code:"IQ", country:"Iraq"},
       { code:"IE", country:"Ireland"},
       { code:"IM", country:"Isle Of Man"},
       { code:"IL", country:"Israel"},
       { code:"IT", country:"Italy"},
       { code:"JM", country:"Jamaica"},
       { code:"JP", country:"Japan"},
       { code:"JE", country:"Jersey"},
       { code:"JO", country:"Jordan"},
       { code:"KZ", country:"Kazakhstan"},
       { code:"KE", country:"Kenya"},
       { code:"KI", country:"Kiribati"},
       { code:"KR", country:"Korea"},
       { code:"KP", country:"North Korea"},
       { code:"KW", country:"Kuwait"},
       { code:"KG", country:"Kyrgyzstan"},
       { code:"LA", country:"Lao People\"s Democratic Republic"},
       { code:"LV", country:"Latvia"},
       { code:"LB", country:"Lebanon"},
       { code:"LS", country:"Lesotho"},
       { code:"LR", country:"Liberia"},
       { code:"LY", country:"Libyan Arab Jamahiriya"},
       { code:"LI", country:"Liechtenstein"},
       { code:"LT", country:"Lithuania"},
       { code:"LU", country:"Luxembourg"},
       { code:"MO", country:"Macao"},
       { code:"MK", country:"Macedonia"},
       { code:"MG", country:"Madagascar"},
       { code:"MW", country:"Malawi"},
       { code:"MY", country:"Malaysia"},
       { code:"MV", country:"Maldives"},
       { code:"ML", country:"Mali"},
       { code:"MT", country:"Malta"},
       { code:"MH", country:"Marshall Islands"},
       { code:"MQ", country:"Martinique"},
       { code:"MR", country:"Mauritania"},
       { code:"MU", country:"Mauritius"},
       { code:"YT", country:"Mayotte"},
       { code:"MX", country:"Mexico"},
       { code:"FM", country:"Micronesia, Federated States Of"},
       { code:"MD", country:"Moldova"},
       { code:"MC", country:"Monaco"},
       { code:"MN", country:"Mongolia"},
       { code:"ME", country:"Montenegro"},
       { code:"MS", country:"Montserrat"},
       { code:"MA", country:"Morocco"},
       { code:"MZ", country:"Mozambique"},
       { code:"MM", country:"Myanmar"},
       { code:"NA", country:"Namibia"},
       { code:"NR", country:"Nauru"},
       { code:"NP", country:"Nepal"},
       { code:"NL", country:"Netherlands"},
       { code:"AN", country:"Netherlands Antilles"},
       { code:"NC", country:"New Caledonia"},
       { code:"NZ", country:"New Zealand"},
       { code:"NI", country:"Nicaragua"},
       { code:"NE", country:"Niger"},
       { code:"NG", country:"Nigeria"},
       { code:"NU", country:"Niue"},
       { code:"NF", country:"Norfolk Island"},
       { code:"MP", country:"Northern Mariana Islands"},
       { code:"NO", country:"Norway"},
       { code:"OM", country:"Oman"},
       { code:"PK", country:"Pakistan"},
       { code:"PW", country:"Palau"},
       { code:"PS", country:"Palestinian Territory, Occupied"},
       { code:"PA", country:"Panama"},
       { code:"PG", country:"Papua New Guinea"},
       { code:"PY", country:"Paraguay"},
       { code:"PE", country:"Peru"},
       { code:"PH", country:"Philippines"},
       { code:"PN", country:"Pitcairn"},
       { code:"PL", country:"Poland"},
       { code:"PT", country:"Portugal"},
       { code:"PR", country:"Puerto Rico"},
       { code:"QA", country:"Qatar"},
       { code:"RE", country:"Reunion"},
       { code:"RO", country:"Romania"},
       { code:"RU", country:"Russian Federation"},
       { code:"RW", country:"Rwanda"},
       { code:"BL", country:"Saint Barthelemy"},
       { code:"SH", country:"Saint Helena"},
       { code:"KN", country:"Saint Kitts And Nevis"},
       { code:"LC", country:"Saint Lucia"},
       { code:"MF", country:"Saint Martin"},
       { code:"PM", country:"Saint Pierre And Miquelon"},
       { code:"VC", country:"Saint Vincent And Grenadines"},
       { code:"WS", country:"Samoa"},
       { code:"SM", country:"San Marino"},
       { code:"ST", country:"Sao Tome And Principe"},
       { code:"SA", country:"Saudi Arabia"},
       { code:"SN", country:"Senegal"},
       { code:"RS", country:"Serbia"},
       { code:"SC", country:"Seychelles"},
       { code:"SL", country:"Sierra Leone"},
       { code:"SG", country:"Singapore"},
       { code:"SK", country:"Slovakia"},
       { code:"SI", country:"Slovenia"},
       { code:"SB", country:"Solomon Islands"},
       { code:"SO", country:"Somalia"},
       { code:"ZA", country:"South Africa"},
       { code:"GS", country:"South Georgia And Sandwich Isl."},
       { code:"ES", country:"Spain"},
       { code:"LK", country:"Sri Lanka"},
       { code:"SD", country:"Sudan"},
       { code:"SR", country:"Suriname"},
       { code:"SJ", country:"Svalbard And Jan Mayen"},
       { code:"SZ", country:"Swaziland"},
       { code:"SE", country:"Sweden"},
       { code:"CH", country:"Switzerland"},
       { code:"SY", country:"Syrian Arab Republic"},
       { code:"TW", country:"Taiwan"},
       { code:"TJ", country:"Tajikistan"},
       { code:"TZ", country:"Tanzania"},
       { code:"TH", country:"Thailand"},
       { code:"TL", country:"Timor-Leste"},
       { code:"TG", country:"Togo"},
       { code:"TK", country:"Tokelau"},
       { code:"TO", country:"Tonga"},
       { code:"TT", country:"Trinidad And Tobago"},
       { code:"TN", country:"Tunisia"},
       { code:"TR", country:"Turkey"},
       { code:"TM", country:"Turkmenistan"},
       { code:"TC", country:"Turks And Caicos Islands"},
       { code:"TV", country:"Tuvalu"},
       { code:"UG", country:"Uganda"},
       { code:"UA", country:"Ukraine"},
       { code:"AE", country:"United Arab Emirates"},
       { code:"GB", country:"United Kingdom"},
       { code:"US", country:"United States"},
       { code:"UM", country:"United States Outlying Islands"},
       { code:"UY", country:"Uruguay"},
       { code:"UZ", country:"Uzbekistan"},
       { code:"VU", country:"Vanuatu"},
       { code:"VE", country:"Venezuela"},
       { code:"VN", country:"Vietnam"},
       { code:"VG", country:"Virgin Islands, British"},
       { code:"VI", country:"Virgin Islands, U.S."},
       { code:"WF", country:"Wallis And Futuna"},
       { code:"EH", country:"Western Sahara"},
       { code:"YE", country:"Yemen"},
       { code:"ZM", country:"Zambia"},
       { code:"ZW", country:"Zimbabwe"}
    ],
    emailRules: [
      v => !!v || 'Email is required',
      v => (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)) || 'Must be a valid e-mail.'
    ],
    usernameRules: [
      v => !!v || 'Username is required',
      v => (v && v.length <= 10) || 'Name must be less than 11',
    ],
    zipCodeRules: [
      v => !!v || 'zipCode is required.',
      //v => (/^(?=\d).{5,5}$/.test(v)) || 'zipCode must be 5 digits.',
      v => (/^[0-9-]{5,5}$/.test(v)) || 'zipCode must be 5 digits.',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v)) || 'The password must be a mixture of min 8 letter, with at least a symbol, upper and lower case letters and a number.'
    ],
    passwordRepeatRules: [
      v => !!v || 'Password is required.',
      v => (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v)) || 'The password must be a mixture of min 8 letter, with at least a symbol, upper and lower case letters and a number.'
    ]
	}),
  props: {
  },
  methods:{ 
    // Rest form
    async register_Reset() {
      console.log("Reset Data")
      const user_data = store.getters['user_store/getUser']
      this.user_temp = JSON.parse(JSON.stringify(user_data))
      // get tags
    this.my_tags = store.getters['tags_store/getTags']
    // loas list of distinct tags
    const token = localStorage.getItem('matcha_token');
     try {
        let axiosConfig = {
          params:{
          },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        let data={
            
        }
        const response = await axios.get("/distinct/",axiosConfig)
        //console.log("response list of tags", response.data)
        //this.items = response.data
        var i
        this.list_tags = []
      for (i = 0; i < response.data.length; i++) {
        this.list_tags.push(response.data[i].tag)
      }
      } catch (e) {
        console.log("error:",e)
        this.error = true
      } finally {
        this.isLoading = false;	
      }
		},
    // Quit of profile
    async register_Quit() {
      this.$router.push("/");
		}, 
    // validate form y data user and save//    
    async validate() {
      //console.log("validate")
        // validate rules of form
        const response = await this.$refs.form.validate()
        if (!response.valid) {
          console.log("validate not ok", response)
          toast("You have to complete require fields, to continue", {
            autoClose: 2000,
            type: "error",
            position: "bottom-right",
          }); 
          return false
        }
        /// check if email not exists
        //console.log("validate email")
        try {
					const response = await axios.get('/users?email='+this.user_temp.email)
          console.log(response)
					if (response.data.length > 0 && response.data[0].uuid!=this.user_temp.uuid){
            this.error = true
						this.error_message = "Oops.. email already exist"
            toast("Oops.. email already exist", {
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_RIGHT,
            });
						return false
					} 
					else {
						this.error = false
            //this.user_temp.email = this.temp_email
						//return true
					}
				} catch (err) {
							console.log(err)
							this.error = true
							this.error_message = err
							return false
				}  
        /// check if new images to load
        if ( this.payload_avatar?.url && this.payload_avatar.url.split(":")[0] === 'blob'){
          await this.load_image(this.user_temp.uuid, this.payload_avatar, 'avatar')  // avatar, img1,.., img4
          var extension =  this.payload_avatar.name.split(".")[1]
          this.user_temp.avatar = this.user_temp.uuid+'-avatar.'+extension
        }        
        if ( this.payload_image1?.url && this.payload_image1.url.split(":")[0] === 'blob'){
          await this.load_image(this.user_temp.uuid, this.payload_image1, 'img1')  // avatar, img1,.., img4
          var extension =  this.payload_image1.name.split(".")[1]
           this.user_temp.img1 = this.user_temp.uuid+'-img1.'+extension
        }
        if ( this.payload_image2?.url && this.payload_image2.url.split(":")[0] === 'blob'){
          await this.load_image(this.user_temp.uuid, this.payload_image2, 'img2')  // avatar, img1,.., img4
          var extension =  this.payload_image2.name.split(".")[1]
          this.user_temp.img2 = this.user_temp.uuid+'-img2.'+extension
        }
        if ( this.payload_image3?.url && this.payload_image3.url.split(":")[0] === 'blob'){
          await this.load_image(this.user_temp.uuid, this.payload_image3, 'img3')  // avatar, img1,.., img4
          var extension =  this.payload_image3.name.split(".")[1]
          this.user_temp.img3 = this.user_temp.uuid+'-img3.'+extension
        }
        if ( this.payload_image4?.url && this.payload_image4.url.split(":")[0] === 'blob'){
          await this.load_image(this.user_temp.uuid, this.payload_image4, 'img4')  // avatar, img1,.., img4
          var extension =  this.payload_image4.name.split(".")[1]
          this.user_temp.img4 = this.user_temp.uuid+'-img4.'+extension
        }

        /// update data
      // Update user info in store
      this.user_temp.completed = 1
			this.$store.commit("user_store/setUser",this.user_temp);
      // Send update to data base
      //this.user_temp.tags = JSON.stringify(this.tags)
      const put_data = JSON.stringify(this.user_temp)
      console.log("new user", put_data)
      const token = localStorage.getItem('matcha_token');
      let axiosConfig = {
        headers: {
          'Content-Type' : 'application/json',
					'Authorization': `Bearer ${token}`,
          //"Access-Control-Allow-Origin": "*",
        }
      };
      try {
			  const response = await axios.put("/users/", 
          put_data, axiosConfig)
        // update my tags in store
        store.commit("tags_store/loadTags", this.my_tags)
        // update my tags in server
				// 1.- delete all tags
        const response_delete = await axios.delete("/tags/",axiosConfig)
        // 2.- save new tags
        var i
        for (i = 0; i < this.my_tags.length; i++) {
            let data={
            tag: this.my_tags[i]
            }
            const response_post = await axios.post("/tags/",data,axiosConfig)
        } 
        // go to home
        this.$router.push("/");
			} catch (err) {
				console.log(err)
				//this.error = true
				//this.error_message = err.response
			} 
      

        return true      
    },
    // method to get location
    async getLocation() {
      const geo = await fetch('http://ip-api.com/json')
      .then(response => response.json())
      .catch (function(e){
            console.log(e)
          });
      console.log("geo",geo)
      this.user_temp.latitude = geo.lat
      this.user_temp.longitude = geo.lon
      /* 
            return new Promise((resolve, reject) => {

              if(!("geolocation" in navigator)) {
                reject(new Error('Geolocation is not available.'));
              }

              navigator.geolocation.getCurrentPosition(pos => {
                resolve(pos);
              }, err => {
                reject(err);
              });

            });
      */
    },
    // method to save avatar image
    imageLoadedAvatar(payload){
      //console.log("recieve avatar image")  
      this.payload_avatar = payload    
    },
    // method to save avatar image
      imageLoadedImage1(payload){
      //console.log("recieve avatar image1") 
      this.payload_image1 = payload    
    },
    // method to save avatar image
      imageLoadedImage2(payload){
      //console.log("recieve avatar image2")  
      this.payload_image2 = payload    
    },
    // method to save avatar image
      imageLoadedImage3(payload){
      //console.log("recieve avatar image3")  
      this.payload_image3 = payload    
    },
    // method to save avatar image
      imageLoadedImage4(payload){
      //console.log("recieve avatar image4")  
      this.payload_image4 = payload    
    },
    // method to load image in backend
    async load_image(uuid, payload, id){
      const formData = new FormData();
      var extension =  payload.name.split(".")[1]
      formData.append('name', uuid+'-'+id+'.'+extension);
      formData.append('image', payload.file);
      formData.append('id', id);                  // avatar, img1,.., img4
      const token = localStorage.getItem('matcha_token');
      let axiosConfig = {
        headers: {
          'Content-Type' : 'multipart/form-data',
					'Authorization': `Bearer ${token}`,
          //"Access-Control-Allow-Origin": "*",
        }
      };
      const response = await axios.post("/upload-image", 
        formData, axiosConfig)	
      //console.log(response)
    },
    // method to register update?
		async register_Update() {
      // change and load in server only images images if is changed 
      if ( this.payload_avatar?.url && this.payload_avatar.url.split(":")[0] === 'blob'){
        await this.load_image(this.user_temp.uuid, this.payload_avatar, 'avatar')  // avatar, img1,.., img4
        var extension =  this.payload_avatar.name.split(".")[1]
        //this.user_temp.img4 = import.meta.env.VITE_APP_SERVER_API+'/images/'+this.user_temp.uuid+'-img4.'+extension
        this.user_temp.avatar = this.user_temp.uuid+'-avatar.'+extension
      }
      if ( this.payload_img1?.url  && this.payload_img1.url.split(":")[0] === 'blob'){
        await this.load_image(this.user_temp.uuid, this.payload_img1, 'img1')  // avatar, img1,.., img4
        var extension =  this.payload_img1.name.split(".")[1]
        //this.user_temp.img4 = import.meta.env.VITE_APP_SERVER_API+'/images/'+this.user_temp.uuid+'-img4.'+extension
        this.user_temp.img1 = this.user_temp.uuid+'-img1.'+extension
      }
      if ( this.payload_img2?.url  && this.payload_img2.url.split(":")[0] === 'blob'){
        await this.load_image(this.user_temp.uuid, this.payload_img2, 'img2')  // avatar, img1,.., img4
        var extension =  this.payload_img2.name.split(".")[1]
        //this.user_temp.img4 = import.meta.env.VITE_APP_SERVER_API+'/images/'+this.user_temp.uuid+'-img4.'+extension
        this.user_temp.img2 = this.user_temp.uuid+'-img2.'+extension
      }
      if ( this.payload_img3?.url  && this.payload_img3.url.split(":")[0] === 'blob'){
        await this.load_image(this.user_temp.uuid, this.payload_img3, 'img3')  // avatar, img1,.., img4
        var extension =  this.payload_img3.name.split(".")[1]
        //this.user_temp.img4 = import.meta.env.VITE_APP_SERVER_API+'/images/'+this.user_temp.uuid+'-img4.'+extension
        this.user_temp.img3 = this.user_temp.uuid+'-img3.'+extension
      }
      if ( this.payload_img4?.url  && this.payload_img4.url.split(":")[0] === 'blob'){
        await this.load_image(this.user_temp.uuid, this.payload_img4, 'img4')  // avatar, img1,.., img4
        var extension =  this.payload_img4.name.split(".")[1]
        //this.user_temp.img4 = import.meta.env.VITE_APP_SERVER_API+'/images/'+this.user_temp.uuid+'-img4.'+extension
        this.user_temp.img4 = this.user_temp.uuid+'-img4.'+extension
      }

      // Update user info in store
			this.$store.commit("user_store/setUser",this.user_temp);
      
      // Send update to data base
      const put_data = JSON.stringify(this.user_temp)
      //console.log("new user", put_data)
      const token = localStorage.getItem('token');
      let axiosConfig = {
        headers: {
          'Content-Type' : 'application/json',
					'Authorization': `Bearer ${token}`,
          //"Access-Control-Allow-Origin": "*",
        }
      };
      try {
			  const response = await axios.put("/users/", 
          put_data, axiosConfig)	
        //console.log("response:",response.data);
				this.$router.push("/");
			} catch (err) {
				console.log(err)
				//this.error = true
				//this.error_message = err.response
			}
      // update my tags in store
      store.commit("tags_store/setTags", this.my_tags)
      // update my tags in server
		},
    // date-picker format
    format (date){
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    format_select_tags (item) {
    return {
          title: item.tag,
          //subtitle: item.department,
        }
    },
    // handle history button
    toggleHistory(){
      this.showHistoryModal ? this.showHistoryModal = false: this.showHistoryModal = true
      //console.log("change show Chat",this.showChatModal)
    },
  },
  watch: {
    // wacth number of tags < 5
      my_tags (val) {
        //console.log(val)
        if (val.length > 5) {
          this.$nextTick(() => this.my_tags.pop())
        }
      },
  },
  async onMounted() {
	},
	async mounted() {
    const user_data = store.getters['user_store/getUser']
    // get a copy of user
    this.user_temp = JSON.parse(JSON.stringify(user_data))
    // get tags
    this.my_tags = store.getters['tags_store/getTags']
    // load list of distinct tags to create a list
    const token = localStorage.getItem('matcha_token');
     try {
        let axiosConfig = {
          params:{
          },
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`,
            //"Access-Control-Allow-Origin": "*",
          }
        };
        let data={
            
        }
        const response = await axios.get("/distinct/",axiosConfig)
        console.log("response list of tags", response.data)
        //this.items = response.data
        var i
        this.list_tags = []
      for (i = 0; i < response.data.length; i++) {
        this.list_tags.push(response.data[i].tag)
      }
      } catch (e) {
        console.log("error:",e)
        this.error = true
      } finally {
        this.isLoading = false;	
      }
      //enable picture after download
      this.enable = true
      //call geolocation
      this.getLocation()
  }, 
  async beforeCreate() {
  }
  }
</script>
<style scoped>
.card-img-drop {
  position: relative;
  width: 6rem;
  height: 6rem;
  margin-top: 0rem;
  margin-bottom: 1rem;
  border: 3px solid #fff;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
  z-index: 2;
}
.modal_mask_history{
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal_body{
  /*position: absolute;
  inset: 50px;*/
  width: 90%;
  height: 90%;
  margin: 20px auto 20px auto;
  padding: 10px 10px;
  background-color: rgb(163, 158, 158);
  border-radius: 12px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.33);  
}
img, svg {
  vertical-align: middle;
}
.v-application .rounded-bl-xl {
    border-bottom-left-radius: 300px !important;
}
.v-application .rounded-br-xl {
    border-bottom-right-radius: 300px !important;
}
</style>