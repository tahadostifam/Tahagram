<template>
  <div id="main_container">
      <div id="chats_list_side">
        <div id="chats_list_side_header">
          <div id="search_chat_input" class="solid_input">
            <input v-model="searchChatInput" type="text" placeholder="Search">
            <span class="icon">
              <v-icon>mdi mdi-magnify</v-icon>
            </span>
          </div>
        </div>
      </div>
      <div id="chat_side"></div>
  </div>
</template>

<script>
export default {
  name: 'MainComponent',
  data() {
    return {
      searchChatInput: ""
    }
  }
};
</script>