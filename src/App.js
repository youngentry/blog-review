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
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [orderForSort, setOrderForSort] = useState("new");
    const [searchInputValue, setSearchInputValue] = useState("");

    const [modifyVisible, setModifyVisible] = useState(false);
    const [contentModalVisible, setContentModalVisible] = useState(false);
    const [searchVisible, setSearchVisible] = useState(false);

    const deletePost = (index) => {
        const tempPostData = [...postData];
        tempPostData.splice(index, 1);
        dispatch(setPostData(tempPostData));
    };

    const openModifyModal = (postId) => {
        const foundPost = postData.find((el) => el.id === postId);
        setSelectedPostId(postId);
        setTitleRenameInput(foundPost.title);
        setModifyVisible(true);
    };

    const modifyPost = (postId, titleRenameInput) => {
        const foundPost = postData.find((el) => el.id === postId);
        setTitleRenameInput(foundPost.title);
        dispatch(modifyPostData([postId, titleRenameInput]));
        setModifyVisible(false);
    };

    const viewContentModal = (postId) => {
        setSelectedPostId(postId);
        // 열려 있는 창을 선택하면 닫힐 수 있도록
        if (selectedPostId === postId && contentModalVisible) {
            return setContentModalVisible(false);
        }
        setContentModalVisible(true);
        setModifyVisible(false);
    };

    const sortPost = (order) => {
        const tempPostData = [...postData];
        setOrderForSort(order);
        if (order === "new") {
            tempPostData.sort((a, b) => b.id - a.id);
        }
        if (order === "old") {
            tempPostData.sort((a, b) => a.id - b.id);
        }
        if (order === "alphabet") {
            tempPostData.sort((a, b) => a.title.localeCompare(b.title));
        }
        setCopiedPostData(tempPostData);
    };

    const searchPost = (searchInputValue) => {
        if (searchInputValue !== "") {
            const tempPostData = [...postData];
            const foundPost = tempPostData.filter((el) => el.title.includes(searchInputValue));
            setCopiedPostData(foundPost);
        }
    };

    const maintainRender = () => {
        setCopiedPostData(postData);
        sortPost(orderForSort);
        searchPost(searchInputValue);
    };

    // 데이터 변경 시 출력 화면 유지
    useEffect(() => {
        console.log(postData);
        maintainRender();
    }, [postData]);

    // 검색어 입력 시 출력 화면 유지
    useEffect(() => {
        maintainRender();
    }, [searchInputValue]);

    return (
        <div className="App">
            <div className="container">
                <Stack gap={1}>
                    <div className="utility">
                        <div className="searchBox">
                            <Button className="searchButton" onClick={() => setSearchVisible(!searchVisible)}>
                                {searchVisible ? "취소하기" : "검색하기"}
                            </Button>
                            <Form.Control
                                className={`me-auto searchInput ${searchVisible && "visible"}`}
                                placeholder="검색어를 입력해주세요."
                                value={searchInputValue}
                                onChange={(e) => setSearchInputValue(e.target.value)}
                                onKeyUp={() => window.event.keyCode === 13 && searchPost(searchInputValue)}
                            />
                            <div className={`magnifyIcon ${searchVisible && "visible"}`} onClick={() => searchPost(searchInputValue)}>
                                🔎
                            </div>
                        </div>
                        <Form.Select className="sort" aria-label="Default select example" value={orderForSort} onChange={(e) => sortPost(e.target.value)}>
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
                                <div key={post.id} className={`bg-light post ${selectedPostId === post.id && modifyVisible && "stressBorder"}`}>
                                    <div className="overviewPost">
                                        <div className={`modifyForm ${selectedPostId === post.id && modifyVisible && "visible"}`}>
                                            <Form.Control
                                                className="me-auto modifyBox"
                                                value={titleRenameInput}
                                                onChange={(e) => setTitleRenameInput(e.target.value)}
                                                onKeyUp={() => window.event.keyCode === 13 && modifyPost(post.id, titleRenameInput)}
                                            />
                                            <Button className="confirm" variant="outline-primary" onClick={() => modifyPost(post.id, titleRenameInput)}>
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
                                                viewContentModal(post.id, index);
                                            }}
                                        >
                                            <strong>{post.title}</strong>
                                            <span>{post.content}</span>
                                        </div>
                                        <div className="buttonBox">
                                            <Button className="modify" variant="outline-primary" onClick={() => openModifyModal(post.id)}>
                                                <strong>수정하기</strong>
                                            </Button>
                                            <Button className="delete" variant="outline-primary" onClick={() => deletePost(index)}>
                                                <strong>삭제하기</strong>
                                            </Button>
                                            <Button className="like" variant="outline-primary" onClick={() => dispatch(plusLike(post.id))}>
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
