import { useTheme } from '@/src/context/ThemeContext';
import React from 'react';
import { BaseToast, BaseToastProps } from 'react-native-toast-message';

export const BigSuccessToast = (props: BaseToastProps) => {
    const {theme} = useTheme();

    const dynamicStyles = {
        toastContainer: {
            backgroundColor: '#e2e2e2ff', 
            borderRadius: 10,
            borderLeftWidth: 4, 
            borderLeftColor: "#109416ff",
        },
        text1: {
            color: theme.green_text, 
            fontSize: 15, 
        },
        text2: {
            color: theme.green_text, 
            fontSize: 14, 
        },
    };

    return (
        <BaseToast
            {...props}
            style={dynamicStyles.toastContainer}
            contentContainerStyle={{
                borderRadius: 10, 
                backgroundColor: '#e2e2e2ff', 
            }}
            text1Style={dynamicStyles.text1}
            text2Style={dynamicStyles.text2}
        />
    );
};

export const BigErrorToast = (props: BaseToastProps) => {
    const {theme} = useTheme();

    const dynamicStyles = {
        toastContainer: {
            backgroundColor: '#e2e2e2ff', 
            borderRadius: 10,
            borderLeftWidth: 4, 
            borderLeftColor: "#d80000ff",
        },
        text1: {
            color: theme.red_button, 
            fontSize: 15, 
        },
        text2: {
            color: theme.red_button, 
            fontSize: 14, 
        },
    };

    return (
        <BaseToast
            {...props}
            style={dynamicStyles.toastContainer}
            contentContainerStyle={{
                borderRadius: 10, 
                backgroundColor: '#e2e2e2ff', 
            }}
            text1Style={dynamicStyles.text1}
            text2Style={dynamicStyles.text2}
        />
    );
};
