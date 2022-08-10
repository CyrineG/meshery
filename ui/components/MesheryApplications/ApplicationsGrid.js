//@ts-check
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React, { useState } from "react";
import MesheryApplicationCard from "./ApplicationsCard";
import { makeStyles } from "@material-ui/core/styles";
import FILE_OPS from "../../utils/configurationFileHandlersEnum";
import ConfirmationMsg from "../ConfirmationModal";
import { getComponentsinFile } from "../../utils/utils";
import PublishIcon from "@material-ui/icons/Publish";

const INITIAL_GRID_SIZE = { xl : 4, md : 6, xs : 12 };

function ApplicationsGridItem({ application,  handleDeploy, handleUnDeploy, handleSubmit, setSelectedApplications }) {
  const [gridProps, setGridProps] = useState(INITIAL_GRID_SIZE);
  const [yaml, setYaml] = useState(application.application_file);

  return (
    <Grid item {...gridProps}>
      <MesheryApplicationCard
        id={application.id}
        name={application.name}
        updated_at={application.updated_at}
        created_at={application.created_at}
        application_file={application.application_file}
        requestFullSize={() => setGridProps({ xl : 12, md : 12, xs : 12 })}
        requestSizeRestore={() => setGridProps(INITIAL_GRID_SIZE)}
        handleDeploy={handleDeploy}
        handleUnDeploy={handleUnDeploy}
        deleteHandler={() => handleSubmit({ data : yaml, id : application.id, type : FILE_OPS.DELETE ,name : application.name })}
        updateHandler={() => handleSubmit({ data : yaml, id : application.id, type : FILE_OPS.UPDATE ,name : application.name, source_type : application.type.String })}
        setSelectedApplications={() => setSelectedApplications({ application : application, show : true })}
        setYaml={setYaml}
      />
    </Grid>
  );
}
const useStyles = makeStyles(() => ({
  pagination : {
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    marginTop : "2rem"
  },
  // text : {
  //   padding : "5px"
  // }
  noApplicationPaper : {
    padding : "0.5rem",
    fontSize : "3rem"
  },
  noApplicationContainer : {
    padding : "2rem",
    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    flexDirection : "column",
  },
  noApplicationText : {
    fontSize : "2rem",
    marginBottom : "2rem",
  },

}))

/**
 * MesheryApplicationGrid is the react component for rendering grid
 * @param {{
 *  applications:Array<{
 *  id:string,
 *  created_at: string,
 *  updated_at: string,
 *  application_file: string,
 * }>,
 *  handleDeploy: (application_file: any) => void,
 *  handleUnDeploy: (application_file: any) => void,
 *  handleSubmit: (data: any, id: string, name: string, type: string) => void,
 *  setSelectedApplication : ({show: boolean, application:any}) => void,
 *  selectedApplication: {show : boolean, application : any},
 *  pages?: number,
 *  selectedPage?: number,
 *  setPage: (page: number) => void
 * }} props props
 */

function MesheryApplicationGrid({ applications=[],handleDeploy, handleUnDeploy, handleSubmit,urlUploadHandler,uploadHandler, setSelectedApplication, selectedApplication, pages = 1,setPage, selectedPage, UploadImport, types }) {

  const classes = useStyles()

  const [importModal, setImportModal] = useState({
    open : false
  });

  const handleUploadImport = () => {
    setImportModal({
      open : true
    });
  }

  const handleUploadImportClose = () => {
    setImportModal({
      open : false
    });
  }

  const [modalOpen, setModalOpen] = useState({
    open : false,
    deploy : false,
    application_file : null,
    name : "",
    count : 0
  });

  const handleModalClose = () => {
    setModalOpen({
      open : false,
      application_file : null,
      name : "",
      count : 0
    });
  }

  const handleModalOpen = (app, isDeploy) => {
    setModalOpen({
      open : true,
      deploy : isDeploy,
      application_file : app.application_file,
      name : app.name,
      count : getComponentsinFile(app.application_file)
    });
  }

  return (
    <div>
      {!selectedApplication.show &&
      <Grid container spacing={3} style={{ padding : "1rem" }}>
        {applications.map((application) => (
          <ApplicationsGridItem
            key={application.id}
            application={application}
            handleDeploy={() => handleModalOpen(application, true)}
            handleUnDeploy={() => handleModalOpen(application, false)}
            handleSubmit={handleSubmit}
            setSelectedApplications={setSelectedApplication}
          />
        ))}

      </Grid>
      }
      {!selectedApplication.show && applications.length === 0 &&
          <Paper className={classes.noApplicationPaper}>
            <div className={classes.noApplicationContainer}>
              <Typography align="center" color="textSecondary" className={classes.noApplicationText}>
                No Applications Found
              </Typography>
              <div>
                <Button
                  aria-label="Add Application"
                  variant="contained"
                  color="primary"
                  size="large"
                  // @ts-ignore
                  onClick={handleUploadImport}
                  style={{ marginRight : "2rem" }}
                >
                  <PublishIcon className={classes.addIcon} />
              Import Application
                </Button>
              </div>
            </div>
          </Paper>
      }
      {applications.length
        ? (
          <div className={classes.pagination} >
            <Pagination count={pages} page={selectedPage+1} onChange={(_, page) => setPage(page - 1)} />
          </div>
        )
        : null}
      <ConfirmationMsg
        open={modalOpen.open}
        handleClose={handleModalClose}
        submit={
          { deploy : () => handleDeploy(modalOpen.application_file), unDeploy : () => handleUnDeploy (modalOpen.application_file) }
        }
        isDelete={!modalOpen.deploy}
        title={ modalOpen.name }
        componentCount={ modalOpen.count }
        tab={modalOpen.deploy ? 0 : 1}
      />
      <UploadImport open={importModal.open} handleClose={handleUploadImportClose} supportedTypes={types} isApplication = {true} aria-label="URL upload button" handleUrlUpload={urlUploadHandler} handleUpload={uploadHandler} configuration="Application"  />
    </div>
  );
}

export default MesheryApplicationGrid;