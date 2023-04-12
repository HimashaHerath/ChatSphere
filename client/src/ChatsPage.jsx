import {
  MultiChatSocket,
  MultiChatWindow,
  useMultiChatLogic,
} from "react-chat-engine-advanced";
const ChatsPage = (props) => {
  const chatProps = useMultiChatLogic(
    "2c84cef0-e060-4c5f-ada1-8208fd0a6f9e",
    props.user.username,
    props.user.secret
  );
  return <div style={{height:'100vh'}}>
    <MultiChatSocket {...chatProps}/>
    <MultiChatWindow {...chatProps} style={{height :'100%'}}/>
    </div>;
};
export default ChatsPage;
