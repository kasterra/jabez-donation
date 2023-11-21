import React, { useState } from "react";
import styled from "styled-components";
import FileUploader from "../components/FileUploader";
import { parseXlsx } from "utils/xlsxParser";
import { Button, Textarea } from "@nextui-org/react";
import { Donation } from "types/donationType";
import { ReactComponent as COPYSVG } from "asset/copy.svg";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 50px;
  justify-content: space-between;
`;

const TextAreasZoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const TextAreaAndCopyButton = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Main = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  return (
    <Wrapper>
      <FileUploader
        onFileUpload={async (file) => {
          const result = await parseXlsx(file);
          setDonations(result);
        }}
      />
      <TextAreasZoneWrapper>
        {donations.length ? (
          donations.map((donation) => (
            <TextAreaAndCopyButton>
              <Textarea
                isReadOnly
                label={donation.donationType}
                variant="bordered"
                labelPlacement="outside"
                defaultValue={donation.data.join(" ")}
                className="max-w-xs"
                width={500}
              />
              <Button
                onClick={() =>
                  navigator.clipboard.writeText(donation.data.join(" "))
                }
              >
                <COPYSVG />
              </Button>
            </TextAreaAndCopyButton>
          ))
        ) : (
          <span>파일을 입력해 주세요</span>
        )}
      </TextAreasZoneWrapper>
    </Wrapper>
  );
};

export default Main;
