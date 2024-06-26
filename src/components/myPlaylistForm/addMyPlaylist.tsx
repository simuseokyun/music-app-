import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { addPlaylistState, libraryAlbumState, libraryPliState, playlistList } from '../../state/atoms';
import { CloseBtn, Message } from '../../styles/common.style';

const Container = styled.div`
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 11;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const AddForm = styled.form`
    background-color: #232322;
    max-width: 500px;
    padding: 20px;
    width: 80%;
    border-radius: 8px;
`;
const FormTop = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const AddFormWrap = styled.div`
    display: flex;
    align-items: start;
    justify-content: space-between;
    @media (max-width: 768px) {
        display: block;
    }
`;
const FormLeft = styled.div``;
const FormRight = styled.div`
    width: 100%;
    margin-left: 20px;
    @media (max-width: 768px) {
        margin-left: 0;
    }
`;
const FormTitle = styled.h1``;
const CoverWrap = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    left: calc(50% - 50px);
`;
const Cover = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const CoverOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.1);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
        font-size: 12px;
    }
`;

const Input = styled.input`
    width: 100%;
    display: inline-block;
    padding: 4px;
    margin-top: 10px;
    outline: none;
    color: white;
    border: 1px solid transparent;
    background-color: rgb(40, 40, 40);
`;

const Title = styled.p`
    margin-bottom: 2px;
    @media (max-width: 768px) {
        margin-top: 10px;
    }
`;
const BtnWrap = styled.div`
    text-align: right;
    margin-top: 20px;
`;
const Btn = styled.button`
    display: inline-block;
    text-align: center;
    background-color: #65d46e;
    border: none;
    border-radius: 20px;
    padding: 4px 8px;
`;

export const AddPlaylistForm = () => {
    const addPlaylist = useSetRecoilState(playlistList);
    const openPlaylist = useSetRecoilState(addPlaylistState);
    const setPliState = useSetRecoilState(libraryPliState);
    const setAlbumState = useSetRecoilState(libraryAlbumState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { register, handleSubmit, setValue } = useForm<{ title: string; file?: FileList }>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                if (typeof e.target?.result === 'string') {
                    setImagePreview(e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const onValid = ({ title }: { title: string; file?: FileList }) => {
        addPlaylist((prev) => {
            const isDuplicate = prev.some((playlist) => playlist.title === title);
            if (isDuplicate) {
                alert('중복된 플레이리스트가 존재합니다');
                return prev;
            }
            const newPlaylist = {
                id: String(Date.now()),
                title: title || `플레이리스트 #${prev.length + 1}`,
                cover: imagePreview ? imagePreview : '/images/basicPlaylist.png',
                tracks: [],
            };

            return [...prev, newPlaylist];
        });
        setPliState(true);
        setAlbumState(false);
        openPlaylist(false);
        setValue('title', '');
    };

    const onClose = () => {
        openPlaylist(false);
    };

    return (
        <Container>
            <AddForm onSubmit={handleSubmit(onValid)}>
                <FormTop>
                    <FormTitle>플레이리스트 생성</FormTitle>
                    <CloseBtn src="/images/closeButton.png" onClick={onClose} />
                </FormTop>
                <AddFormWrap>
                    <FormLeft>
                        <CoverWrap>
                            <Cover
                                src={imagePreview ? imagePreview : '/images/basicPlaylist.png'}
                                alt="Preview"
                            ></Cover>
                            <CoverOverlay onClick={handleClick}>
                                <Message>사진 선택</Message>
                            </CoverOverlay>
                        </CoverWrap>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                    </FormLeft>
                    <FormRight>
                        <Title>제목</Title>
                        <Input
                            {...register('title', {
                                required: false,
                                maxLength: { value: 12, message: '12글자 이하로 입력해주세요' },
                            })}
                            type="text"
                            placeholder="플레이리스트 이름을 작성해주세요"
                        />
                    </FormRight>
                </AddFormWrap>
                <BtnWrap>
                    <Btn type="submit">생성하기</Btn>
                </BtnWrap>
            </AddForm>
        </Container>
    );
};
