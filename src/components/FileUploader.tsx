import styled from "styled-components";
import { ReactComponent as XLSSVG } from "asset/xls.svg";
import React, { useCallback, useEffect, useRef } from "react";

const Wrapper = styled.label`
  width: 350px;
  height: 500px;
  border-radius: 12px;
  border: 1px dashed #000;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 108px;
  & > input {
    display: none;
  }
`;

const Images = styled.div`
  display: flex;
  justify-content: center;
  gap: 35px;
  & > svg {
    width: 130px;
    height: 130px;
  }
`;

const Description = styled.div`
  text-align: center;
  font-family: Noto Sans KR;
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
`;

interface Prop {
  onFileUpload: (file: File) => Promise<void>;
}

const FileUploader = ({ onFileUpload }: Prop) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLLabelElement>(null);

  const validateFileExtension = (file: File) => {
    const extension = file.name.split(".").pop();
    if (extension === "xlsx") {
      return true;
    }
    return false;
  };

  const processFileFromEvent = useCallback(
    (dataTransfer: DataTransfer | null, inputFiles: FileList | null): void => {
      let file: File;
      if (dataTransfer) {
        file = dataTransfer.files[0];
      } else if (inputFiles) {
        file = inputFiles[0];
      } else {
        throw new Error("Invalid Argument in processFileFromEvent");
      }
      if (!validateFileExtension(file)) {
        alert("지원하지 않는 파일 형식입니다.");
        return;
      }
      onFileUpload(file);
    },
    [onFileUpload]
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    processFileFromEvent(null, e.target.files);
  };

  const handleDropReact = (e: React.DragEvent<HTMLLabelElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    processFileFromEvent(e.dataTransfer, null);
  };

  const nativeHandleDragIn = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const nativeHandleDragOut = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const nativeHandleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const nativeHandleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      processFileFromEvent(e.dataTransfer, null);
    },
    [processFileFromEvent]
  );

  const initDragEvents = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.addEventListener("dragenter", nativeHandleDragIn);
      dragRef.current.addEventListener("dragleave", nativeHandleDragOut);
      dragRef.current.addEventListener("dragover", nativeHandleDragOver);
      dragRef.current.addEventListener("drop", nativeHandleDrop);
    }
  }, [
    nativeHandleDragIn,
    nativeHandleDragOut,
    nativeHandleDragOver,
    nativeHandleDrop,
  ]);
  const resetDragEvents = useCallback(() => {
    if (dragRef.current) {
      dragRef.current.removeEventListener("dragenter", nativeHandleDragIn);
      dragRef.current.removeEventListener("dragleave", nativeHandleDragOut);
      dragRef.current.removeEventListener("dragover", nativeHandleDragOver);
      dragRef.current.removeEventListener("drop", nativeHandleDrop);
    }
  }, [
    nativeHandleDragIn,
    nativeHandleDragOut,
    nativeHandleDragOver,
    nativeHandleDrop,
  ]);

  useEffect(() => {
    initDragEvents();
    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return (
    <Wrapper ref={dragRef} htmlFor="fileUpload" onDrop={handleDropReact}>
      <input
        type="file"
        id="fileUpload"
        multiple={false}
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".xlsx"
      />
      <Images>
        <XLSSVG />
      </Images>
      <Description>
        <span>
          파일을 끌어다 놓거나
          <br />
          여기를 눌러 파일을 업로드
        </span>
      </Description>
    </Wrapper>
  );
};

export default FileUploader;
