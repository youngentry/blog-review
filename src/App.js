import "./css/reset.css";
import "./css/App.scss";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { modifyPostData, plusLike, setPostData } from "./store";
import WriteForm from "./components/WriteForm";

function App() {
    const dispatch = useDispatch();
    const postData = useSelector((state) => state.postData);
    const [copiedPostData, setCopiedPostData] = useState([...postData]);
    const [titleRenameInput, setTitleRenameInput] = useState("");
    const [selectedPostIndex, setSelectedPostIndex] = useState(null);
    const [modifyVisible, setModifyVisible] = useState(false);
    const [contentModalVisible, setContentModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [orderForSort, setOrderForSort] = useState(1);

    const deletePost = (index) => {
        const tempPostData = [...copiedPostData];
        tempPostData.splice(index, 1);
        dispatch(setPostData(tempPostData));
    };

    const openPostModify = (index) => {
        setTitleRenameInput(copiedPostData[index].title);
        setSelectedPostIndex(index);
        setModifyVisible(true);
    };

    const modifyPost = (index) => {
        dispatch(modifyPostData([index, titleRenameInput]));
        setModifyVisible(false);
    };

    const openContentModal = (id, index) => {
        setSelectedPostId(id);
        setSelectedPostIndex(index);
        setContentModalVisible(true);
    };

    const sortPost = (e) => {
        const tempPostData = [...copiedPostData];
        const order = e.target.value;
        setOrderForSort(order);

        if (order === "new") {
            tempPostData.sort((a, b) => a.id - b.id);
            setCopiedPostData(tempPostData);
        }
        if (order === "old") {
            tempPostData.sort((a, b) => b.id - a.id);
            setCopiedPostData(tempPostData);
        }
        if (order === "alphabet") {
            tempPostData.sort((a, b) => a.title.localeCompare(b.title));
            setCopiedPostData(tempPostData);
        }
    };

    useEffect(() => {
        console.log(postData);
        setModifyVisible(false);
        setCopiedPostData([...postData]);
    }, [postData]);

    return (
        <div className="App">
            <div className="container">
                <Stack gap={1}>
                    <div className="utility">
                        <span className="search">검색</span>
                        <Form.Select className="sort" aria-label="Default select example" value={orderForSort} onChange={(e) => sortPost(e)}>
                            <option value="new">최신순</option>
                            <option value="old">오래된 순</option>
                            <option value="alphabet">가나다순</option>
                        </Form.Select>
                    </div>
                    <WriteForm />
                    {postData.length === 0 ? (
                        <div>게시물이 없습니다.</div>
                    ) : (
                        copiedPostData.map((post, index) => {
                            return (
                                <div key={post.id} className="bg-light border post">
                                    <div className="overviewPost">
                                        <div className={`modifyForm ${selectedPostIndex === index && modifyVisible && "visible"}`}>
                                            <Form.Control
                                                className="me-auto modifyBox"
                                                value={titleRenameInput}
                                                onChange={(e) => setTitleRenameInput(e.target.value)}
                                                onKeyUp={() => window.event.keyCode === 13 && modifyPost(index)}
                                            />
                                            <Button className="confirm" variant="outline-primary" onClick={() => modifyPost(index)}>
                                                <strong>확인</strong>
                                            </Button>
                                            <Button className="cancel" variant="outline-primary" onClick={() => setModifyVisible(false)}>
                                                <strong>취소</strong>
                                            </Button>
                                        </div>
                                        <div
                                            className="text"
                                            onClick={() => {
                                                console.log(post);
                                                openContentModal(post.id, index);
                                            }}
                                        >
                                            <strong>{post.title}</strong>
                                            <span>{post.content}</span>
                                        </div>
                                        <div className="buttonBox">
                                            <Button className="modify" variant="outline-primary" onClick={() => openPostModify(index)}>
                                                <strong>수정하기</strong>
                                            </Button>
                                            <Button className="delete" variant="outline-primary" onClick={() => deletePost(index)}>
                                                <strong>삭제하기</strong>
                                            </Button>
                                            <Button className="like" variant="outline-primary" onClick={() => dispatch(plusLike(index))}>
                                                <strong>❤</strong>
                                                <span>{copiedPostData[index].like}</span>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className={`contentModal ${selectedPostId === post.id && contentModalVisible && "visible"}`}>
                                        <span className="date">{post.date}</span>
                                        <p>{post.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
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
