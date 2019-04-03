import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const defaultTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
});

export const themePalette = {
    primary: {
        main: "#cc0000",
    },
}

export const darkTheme = createMuiTheme({
    ...defaultTheme,
    palette: {
        type: 'dark',
        ...themePalette,
    },
    props: {
        MuiButton: {
            variant: 'contained'
        },
        MuiTypography: {
            color: 'textPrimary'
        }
    }
});

export default createMuiTheme({
    ...darkTheme,
    palette: themePalette,
});

