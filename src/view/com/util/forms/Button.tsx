import React from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  Pressable,
  ViewStyle,
  PressableStateCallbackType,
  ActivityIndicator,
  View,
} from 'react-native'
import {Text} from '../text/Text'
import {useTheme} from 'lib/ThemeContext'
import {choose} from 'lib/functions'
import {s} from '#/lib/styles'

type Event =
  | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  | GestureResponderEvent

export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'default'
  | 'inverted'
  | 'primary-outline'
  | 'secondary-outline'
  | 'primary-light'
  | 'secondary-light'
  | 'default-light'

// Augment type for react-native-web (see https://github.com/necolas/react-native-web/issues/1684#issuecomment-766451866)
declare module 'react-native' {
  interface PressableStateCallbackType {
    hovered?: boolean
    focused?: boolean
  }
}

// TODO: Enforce that button always has a label
export function Button({
  type = 'primary',
  label,
  style,
  StartIcon,
  EndIcon,
  labelContainerStyle,
  labelStyle,
  onPress,
  children,
  testID,
  accessibilityLabel,
  accessibilityHint,
  accessibilityLabelledBy,
  onAccessibilityEscape,
  withLoading = false,
}: React.PropsWithChildren<{
  type?: ButtonType
  label?: string
  style?: StyleProp<ViewStyle>
  StartIcon?: React.ReactElement
  EndIcon?: React.ReactElement
  labelContainerStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  onPress?: () => void | Promise<void>
  testID?: string
  accessibilityLabel?: string
  accessibilityHint?: string
  accessibilityLabelledBy?: string
  onAccessibilityEscape?: () => void
  withLoading?: boolean
}>) {
  const theme = useTheme()
  const typeOuterStyle = choose<ViewStyle, Record<ButtonType, ViewStyle>>(
    type,
    {
      primary: {
        backgroundColor: theme.palette.primary.background,
      },
      secondary: {
        backgroundColor: theme.palette.secondary.background,
      },
      default: {
        backgroundColor: theme.palette.default.backgroundLight,
      },
      inverted: {
        backgroundColor: theme.palette.inverted.background,
      },
      'primary-outline': {
        backgroundColor: theme.palette.default.background,
        borderWidth: 1,
        borderColor: theme.palette.primary.border,
      },
      'secondary-outline': {
        backgroundColor: theme.palette.default.background,
        borderWidth: 1,
        borderColor: theme.palette.secondary.border,
      },
      'primary-light': {
        backgroundColor: theme.palette.default.background,
      },
      'secondary-light': {
        backgroundColor: theme.palette.default.background,
      },
      'default-light': {
        backgroundColor: theme.palette.default.background,
      },
    },
  )
  const typeLabelStyle = choose<TextStyle, Record<ButtonType, TextStyle>>(
    type,
    {
      primary: {
        color: theme.palette.primary.text,
        fontWeight: '600',
      },
      secondary: {
        color: theme.palette.secondary.text,
        fontWeight: theme.palette.secondary.isLowContrast ? '500' : undefined,
      },
      default: {
        color: theme.palette.default.text,
      },
      inverted: {
        color: theme.palette.inverted.text,
        fontWeight: '600',
      },
      'primary-outline': {
        color: theme.palette.primary.textInverted,
        fontWeight: theme.palette.primary.isLowContrast ? '500' : undefined,
      },
      'secondary-outline': {
        color: theme.palette.secondary.textInverted,
        fontWeight: theme.palette.secondary.isLowContrast ? '500' : undefined,
      },
      'primary-light': {
        color: theme.palette.primary.textInverted,
        fontWeight: theme.palette.primary.isLowContrast ? '500' : undefined,
      },
      'secondary-light': {
        color: theme.palette.secondary.textInverted,
        fontWeight: theme.palette.secondary.isLowContrast ? '500' : undefined,
      },
      'default-light': {
        color: theme.palette.default.text,
        fontWeight: theme.palette.default.isLowContrast ? '500' : undefined,
      },
    },
  )

  const [isLoading, setIsLoading] = React.useState(false)
  const onPressWrapped = React.useCallback(
    async (event: Event) => {
      event.stopPropagation()
      event.preventDefault()
      withLoading && setIsLoading(true)
      await onPress?.()
      withLoading && setIsLoading(false)
    },
    [onPress, withLoading],
  )

  const getStyle = React.useCallback(
    (state: PressableStateCallbackType) => {
      const arr = [typeOuterStyle, styles.outer, style]
      if (state.pressed) {
        arr.push({opacity: 0.6})
      } else if (state.hovered) {
        arr.push({opacity: 0.8})
      }
      return arr
    },
    [typeOuterStyle, style],
  )

  const renderChildren = React.useCallback(() => {
    if (!label) {
      return children
    }

    return (
      <View style={[styles.labelContainer, labelContainerStyle]}>
        {React.isValidElement(StartIcon) && !isLoading ? StartIcon : null}

        {label && withLoading && isLoading ? (
          <ActivityIndicator
            style={s.mr2}
            size={12}
            color={typeLabelStyle.color}
          />
        ) : null}

        <Text type="button" style={[typeLabelStyle, labelStyle]}>
          {label}
        </Text>

        {React.isValidElement(EndIcon) && !isLoading && EndIcon}
      </View>
    )
  }, [
    label,
    labelContainerStyle,
    StartIcon,
    withLoading,
    isLoading,
    typeLabelStyle,
    labelStyle,
    EndIcon,
    children,
  ])

  return (
    <Pressable
      style={getStyle}
      onPress={onPressWrapped}
      disabled={isLoading}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityLabelledBy={accessibilityLabelledBy}
      onAccessibilityEscape={onAccessibilityEscape}>
      {renderChildren}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})
