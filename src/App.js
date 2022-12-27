import "./css/reset.css";
import "./css/App.scss";
import Button from "react-bootstrap/Button";
import { useRef, useState } from "react";
import { Form, Stack } from "react-bootstrap";

function App() {
    const [postData, setPostData] = useState([]);
    const [likeData, setLikeData] = useState([]);
    const [titleInput, setTitleInput] = useState("");

    const titleInputRef = useRef();

    const writeNewPost = (input) => {
        if (input === "") {
            return titleInputRef.current.focus();
        }
        const tempPostData = [...postData];
        tempPostData.unshift(input);
        setPostData(tempPostData);
        setTitleInput("");

        const tempLikes = [...likeData];
        tempLikes.unshift(0);
        setLikeData(tempLikes);
    };

    const plusLike = (index) => {
        const tempLikeData = [...likeData];
        tempLikeData[index] += 1;
        setLikeData(tempLikeData);
    };

    const deletePost = (index) => {
        const tempPostData = [...postData];
        tempPostData.splice(index, 1);
        setPostData(tempPostData);
    };

    return (
        <div className="App">
            <div className="container">
                <Stack className="writeForm" direction="horizontal" gap={3}>
                    <Form.Control className="me-auto" placeholder="글 제목을 입력해주세요" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} ref={titleInputRef} />
                    <Button className="writeButton" variant="secondary" onClick={() => writeNewPost(titleInput)}>
                        글쓰기
                    </Button>
                </Stack>
                <Stack gap={1}>
                    {postData.map((post, index) => {
                        return (
                            <div className="bg-light border post">
                                <div className="text">
                                    <strong>{post}</strong>
                                    <span>content</span>
                                </div>
                                <div className="buttonBox">
                                    <Button className="modify" variant="outline-primary" onClick={() => {}}>
                                        <strong>수정하기</strong>
                                    </Button>
                                    <Button className="delete" variant="outline-primary" onClick={() => deletePost(index)}>
                                        <strong>삭제하기</strong>
                                    </Button>
                                    <Button className="like" variant="outline-primary" onClick={() => plusLike(index)}>
                                        <strong>❤</strong>
                                        <span>{likeData[index]}</span>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Stack>
            </div>
        </div>
    );
}
// 글추가 순서
// 입력 값 저장할 titleState 만들기
// input value를 titleState와 같도록 설정하기
// setTitleState로 input value값으로 변화시키기
// input value가 비어있으면 입력창 포커스하기
// 데이터에 input value 추가하기
// input value 초기화하기

export default App;
