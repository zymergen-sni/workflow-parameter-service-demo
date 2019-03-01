import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

const styles = theme => ({
  actionButton: { marginRight: 20 },
  textField: { margin: 10 },
  addDeleteButton: { marginTop: 14 },
  paramSetNameLabel: {
    color: "#ca6b23",
    float: "left",
    marginLeft: 10,
    fontStyle: "italic"
  },
  stepLabel: {
    float: "left"
  }
});

class CreateParamSetForm extends React.Component {
  state = { activeStep: 0 };

  getSteps = () => {
    return ["Enter Param Set Name", "Add parameters", "Add usages"];
  };

  changeParamSetName = () => event => {
    const paramSetName = event.target.value;
    this.props.data.label = paramSetName;
    this.props.updateItemsToBeCreated(this.props.index, this.props.data);
  };

  onDefinitionChange = (index, name) => event => {
    let definition = this.props.data.definition.slice();
    definition[index][name] = event.target.value;
    if (index === definition.length - 1) {
      definition = [...definition, { key: "", value: "" }];
    }
    this.props.data.definition = definition;
    this.props.updateItemsToBeCreated(this.props.index, this.props.data);
  };

  onUsageContextChange = index => event => {
    let usages = this.props.data.usages.slice();
    usages[index] = event.target.value;
    if (index === usages.length - 1) {
      usages = [...usages, ""];
    }
    this.props.data.usages = usages;
    this.props.updateItemsToBeCreated(this.props.index, this.props.data);
  };

  addNewRow = dataSet => {
    let definition = this.props.data.definition.slice();
    definition = [...definition, { key: "", value: "" }];
    this.props.data.definition = definition;
    this.props.updateItemsToBeCreated(this.props.index, this.props.data);
  };

  deleteRow = index => () => {
    let definition = this.props.data.definition.slice();
    definition.splice(index, 1);
    this.props.data.definition = definition;
    this.props.updateItemsToBeCreated(this.props.index, this.props.data);
  };

  reset = () => {
    this.changeActiveStep(0)();
    this.props.data.label = "";
    this.props.data.definition = [{ key: "", value: "" }];
    this.props.data.usages = [""];
    this.props.updateItemsToBeCreated(this.props.index, this.props.data);
  };

  getStepContent = (step, classes, paramSetName, definition, usages, self) => {
    switch (step) {
      case 0:
        return (
          <TextField
            label=""
            className={classes.textField}
            value={paramSetName}
            onChange={self.changeParamSetName()}
            margin="normal"
          />
        );
      case 1:
        return (
          <form className={classes.container} noValidate autoComplete="off">
            {definition.map((param, index) => (
              <div key={index}>
                <TextField
                  label="Key"
                  className={classes.textField}
                  value={param.key}
                  onChange={this.onDefinitionChange(index, "key")}
                  margin="normal"
                />
                <TextField
                  label="Value"
                  className={classes.textField}
                  value={param.value}
                  margin="normal"
                  onChange={this.onDefinitionChange(index, "value")}
                />
                {index === definition.length - 1 ? (
                  <IconButton
                    onClick={this.addNewRow}
                    aria-label="Add"
                    className={classes.addDeleteButton}
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  ""
                )}
                {definition.length > 1 ? (
                  <IconButton
                    aria-label="Delete"
                    onClick={this.deleteRow(index)}
                    className={classes.addDeleteButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  ""
                )}
              </div>
            ))}
          </form>
        );

      case 2:
        return (
          <form className={classes.container} noValidate autoComplete="off">
            {usages.map((usageContext, index) => (
              <div key={index}>
                <TextField
                  label="Usage Context Name"
                  className={classes.textField}
                  value={usageContext}
                  onChange={this.onUsageContextChange(index)}
                  margin="normal"
                />
                {index === usages.length - 1 ? (
                  <IconButton
                    onClick={this.addNewRow}
                    aria-label="Add"
                    className={classes.addDeleteButton}
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  ""
                )}
                {usages.length > 1 ? (
                  <IconButton
                    aria-label="Delete"
                    onClick={this.deleteRow(index)}
                    className={classes.addDeleteButton}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  ""
                )}
              </div>
            ))}
          </form>
        );
      default:
        return "Unknown step";
    }
  };

  handleNext = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(prevState => ({
      activeStep: prevState.activeStep - 1
    }));
  };

  changeActiveStep = index => () => {
    this.setState(() => ({
      activeStep: index
    }));
  };

  render() {
    const { classes, data, isLast } = this.props;
    const { definition, usages } = data;
    const { activeStep } = this.state;
    const paramSetName = data.label;
    const steps = this.getSteps();
    return (
      <div className={classes.stepper}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                {data.label && index === 0 && activeStep !== 0 ? (
                  <div>
                    <Typography
                      variant="subtitle1"
                      className={classes.stepLabel}
                      onClick={this.changeActiveStep(index)}
                    >
                      {this.props.index}:
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      className={classes.paramSetNameLabel}
                      onClick={this.changeActiveStep(index)}
                    >
                      {data.label}
                    </Typography>
                  </div>
                ) : (
                  <Typography
                    variant="subtitle1"
                    onClick={this.changeActiveStep(index)}
                  >
                    {label}
                  </Typography>
                )}
              </StepLabel>
              <StepContent>
                {this.getStepContent(
                  index,
                  classes,
                  paramSetName,
                  definition,
                  usages,
                  this
                )}
                <div className={classes.actionsContainer}>
                  <div>
                    {index === 0 ? (
                      ""
                    ) : (
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.actionButton}
                      >
                        Back
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.actionButton}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && isLast && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Button onClick={this.reset} className={classes.actionButton}>
              Reset
            </Button>
            <Button
              color="primary"
              onClick={this.props.addNewParamSet}
              className={classes.actionButton}
              variant="contained"
            >
              <AddIcon />
              Add more
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

CreateParamSetForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(CreateParamSetForm);