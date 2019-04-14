import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const defaultTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
        fontFamily: 'Maven Pro'
    },
});

export const themePalette = {
    primary: {
        main: "#b30000",
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
            variant: 'contained',
            color: 'primary'
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

