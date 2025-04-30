# 音频图片合成高清视频工具

这个工具可以将MP3音频文件和高清图片合成为高质量的MOV视频文件。

## 系统要求

- Node.js
- FFmpeg

## 安装FFmpeg

如果还没有安装FFmpeg，请使用以下命令安装：

```bash
brew install ffmpeg
```

## 使用方法

```bash
node combine.js <音频文件> <图片文件> <输出文件>
```

例如：
```bash
node combine.js input.mp3 HD-Cover.png output.mov
```

## 输出规格

- 视频编码：H.264
- 视频分辨率：1920x1080
- 视频质量：CRF 15（高质量）
- 音频编码：AAC
- 音频比特率：320kbps
- 输出格式：MOV
- 预期文件大小：5-8GB（取决于输入文件时长）

## 注意事项

1. 处理时间可能较长，这是为了确保最高的输出质量
2. 确保有足够的磁盘空间
3. 建议使用高质量的输入文件（HD图片和高比特率MP3） # combineToMov
