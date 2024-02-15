import React, { useRef } from "react";
import i18n from "i18next";
import { Button, Modal, ModalFooter, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSWR from "swr";

import Spinner from "../../../../components/Spinner/Spinner";

import { MY_INVESTMENTS_API } from "../../../../../../store/actions/apiCollections";
import { getDocumentDetailFetcher } from "../../../../../../swrHelpers/swrMyInvestments";
import { getBaseImageURL } from "../../../../../../helpers/url";

const DocumentsModal = ({ handleClose, show, transactionId }) => {
  const globalImagePath = useRef(getBaseImageURL());

  /**
   * @Author Rockers Technology
   * This hook is used to fetch list of documents
   * It's related to My Investment module
   * @param $MY_INVESTMENTS_API - Unique api
   * @param $getDocumentDetailFetcher - swr fetcher helper
   *
   * @return list of documents
   */
  const { data: investmentDocuments, isValidating: documentDetailLoader } =
    useSWR(
      `${MY_INVESTMENTS_API}${transactionId}/get-document-detail`,
      getDocumentDetailFetcher,
      {
        keepPreviousData: true,
        dedupingInterval: 120000,
      }
    );
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title as="h5">{i18n.t("extras.document")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          {investmentDocuments?.investmentInfo?.contractDocument ||
          investmentDocuments?.extraDocumentData?.length > 0 ? (
            <Row className="my-documents">
              {investmentDocuments?.investmentInfo?.contractDocument ? (
                <a
                  className="col-md-5 my-documents-item mr-2"
                  target="_blank"
                  href={`${globalImagePath.current}${investmentDocuments?.investmentInfo?.contractDocument}`}
                  download={`${globalImagePath.current}${investmentDocuments?.investmentInfo?.contractDocument}`}
                  rel="noopener noreferrer"
                >
                  <div className="my-documents-title">
                    {i18n.t("myInvestment.investmentContract")}
                  </div>
                  <FontAwesomeIcon
                    icon={["fas", "download"]}
                    className="my-documents-download-icon"
                  />
                </a>
              ) : null}
              {investmentDocuments?.extraDocumentData?.length > 0
                ? investmentDocuments?.extraDocumentData.map(
                    (document, key) => (
                      <a
                        className="col-md-5 my-documents-item mr-2"
                        key={key}
                        target="_blank"
                        href={`${globalImagePath.current}${document.documentUrl}`}
                        download={`${globalImagePath.current}${document.documentUrl}`}
                        rel="noopener noreferrer"
                      >
                        <div className="my-documents-title">
                          {document.documentTitle}
                        </div>
                        <FontAwesomeIcon
                          icon={["fas", "download"]}
                          className="my-documents-download-icon"
                        />
                      </a>
                    )
                  )
                : null}
            </Row>
          ) : documentDetailLoader ? (
            <div className="mb-5 mt-5">
              <Spinner
                position={"center"}
                width={"4rem"}
                height={"4rem"}
                opacity={"0.5"}
              />
            </div>
          ) : (
            <div className="in-dashboard-content">
              <div className="no-data no-data-img-equity">
                <p>{i18n.t("myInvestment.noDocumentsAdded")}</p>
              </div>
            </div>
          )}
        </>
      </Modal.Body>
      <ModalFooter>
        <Button variant="primary" className="btn-sm" onClick={handleClose}>
          {i18n.t("global.close")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DocumentsModal;
