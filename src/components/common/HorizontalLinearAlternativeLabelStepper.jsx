import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

export default function HorizontalLinearAlternativeLabelStepper({
  activeStep,
  steps,
  onStepClick,
}) {
  return (
    <Box sx={{ 
      width: "100%", 
      mb: 3, 
      mt: 2, 
      overflowX: 'auto',
      scrollbarWidth: 'none', 
      '&::-webkit-scrollbar': { display: 'none' },
      pb: 1
    }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          minWidth: { xs: '600px', sm: '100%' },
          "& .MuiStepConnector-line": {
            borderColor: "#D1A05433",
            borderTopWidth: 3,
            borderRadius: 1,
            transition: "border-color 0.4s ease",
          },
          "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
            borderColor: "#312109",
          },
          "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
            borderColor: "#312109",
          },
        }}
      >
        {steps.map((label, index) => (
          <Step
            key={index}
            onClick={() => onStepClick && onStepClick(index + 1)}
            sx={{ cursor: onStepClick ? "pointer" : "default" }}
          >
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  mt: 1,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#9b8878",
                  "&.Mui-active": {
                    color: "#312109",
                    fontWeight: 700,
                  },
                  "&.Mui-completed": {
                    color: "#312109",
                  },
                },
                "& .MuiStepIcon-root": {
                  fontSize: "2rem",
                  color: "#fff",
                  border: "1px solid #D1A05480",
                  borderRadius: "50%",
                  "& .MuiStepIcon-text": {
                    fill: "#9b8878",
                    fontWeight: 700,
                  },
                  "&.Mui-active": {
                    color: "#EBC080",
                    borderColor: "#312109",
                    "& .MuiStepIcon-text": {
                      fill: "#312109",
                    },
                  },
                  "&.Mui-completed": {
                    color: "#312109",
                    borderColor: "#312109",
                    "& .MuiStepIcon-text": {
                      fill: "#EBC080",
                    },
                  },
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
