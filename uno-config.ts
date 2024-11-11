// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  // 自定义一些样式
  shortcuts: {
    center: 'flex items-center justify-center',
    'primary-color': 'text-#227fd9',
    'bg-primary-color': 'bg-#227fd9',
    'border-primary-rounded': 'border-#ddd border-1 border-solid rounded-full',
    itemCenter: 'absolute left-50% top-50% transform -translate-x-50% -translate-y-50%'
  },
  theme: {},
  presets: [
    // 修改字体基准
    presetRemToPx({
      baseFontSize: 4
    }),
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerAttributifyJsx()]
})
