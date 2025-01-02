#!/bin/bash
# https://gist.github.com/supersonictw/f6cf5e599377132fe5e180b3d495c553
# Ollama Model Export Script
# Usage: bash ollama-export.sh vicuna:7b
# SPDX-License-Identifier: MIT (https://ncurl.xyz/s/o_o6DVqIR)
# link https://drive.google.com/drive/folders/1u6F_Wiq2yFmw9bMo2hfZU0PwZ9l6Tl0m
# https://gist.github.com/supersonictw/f6cf5e599377132fe5e180b3d495c553


# import code
#  ollama create tinyllama -f tinyllama-latest/Modelfile

# Interrupt if any error occurred
set -e

# Declare
echo "Ollama Model Export Script"
echo "License: MIT (https://ncurl.xyz/s/o_o6DVqIR)"
echo ""

# OS-specific
case "$OSTYPE" in
linux*)
    HOME="$(echo ~ollama)"
    ;;
esac

# Define variables
OLLAMA_HOME="${OLLAMA_HOME:="$HOME/.ollama"}"
BLOBS_FILE_BASE_PATH="$OLLAMA_HOME/models/blobs"
MANIFESTS_FILE_BASE_PATH="$OLLAMA_HOME/models/manifests"

# Define constants
SUCCESS_PREFIX="\033[1;32mSuccess:\033[0m"
FAILED_PREFIX="\033[0;31mFailed:\033[0m"

# Read arguments
IFS='/' read -ra NAME_ARGS <<< "${1/://}"
case "${#NAME_ARGS[@]}" in
4)
    MANIFESTS_REGISTRY_NAME="${NAME_ARGS[0]}"
    MANIFESTS_LIBRARY_NAME="${NAME_ARGS[1]}"
    MANIFESTS_MODEL_NAME="${NAME_ARGS[2]}"
    MANIFESTS_PARAMS_NAME="${NAME_ARGS[3]}"
    ;;
3)
    MANIFESTS_LIBRARY_NAME="${NAME_ARGS[0]}"
    MANIFESTS_MODEL_NAME="${NAME_ARGS[1]}"
    MANIFESTS_PARAMS_NAME="${NAME_ARGS[2]}"
    ;;
2)
    MANIFESTS_MODEL_NAME="${NAME_ARGS[0]}"
    MANIFESTS_PARAMS_NAME="${NAME_ARGS[1]}"
    ;;
1)
    MANIFESTS_MODEL_NAME="${NAME_ARGS[0]}"
    ;;
esac

# Define variables
MANIFESTS_REGISTRY_NAME="${MANIFESTS_REGISTRY_NAME:="registry.ollama.ai"}"
MANIFESTS_LIBRARY_NAME="${MANIFESTS_LIBRARY_NAME:="library"}"
MANIFESTS_MODEL_NAME="${MANIFESTS_MODEL_NAME:="tinyllama"}"
MANIFESTS_PARAMS_NAME="${MANIFESTS_PARAMS_NAME:="latest"}"

# Echo the model full name
MODEL_FULL_NAME="$MANIFESTS_MODEL_NAME:$MANIFESTS_PARAMS_NAME"
echo "Exporting model \"$MODEL_FULL_NAME\"..."
echo ""

# Make sure manifests exist
MANIFESTS_FILE_PATH="$MANIFESTS_FILE_BASE_PATH/$MANIFESTS_REGISTRY_NAME/$MANIFESTS_LIBRARY_NAME/$MANIFESTS_MODEL_NAME/$MANIFESTS_PARAMS_NAME"
if [ ! -f "$MANIFESTS_FILE_PATH" ]; then
    echo -e "$FAILED_PREFIX \"$MANIFESTS_FILE_PATH\" not exists, the model \"$MODEL_FULL_NAME\" you requested is not found."
    exit 1
fi

# Make sure dist not exist
EXPORT_DST_BASE_PATH="${EXPORT_DST_BASE_PATH:="$PWD/${MODEL_FULL_NAME/:/-}"}"
if [ -d "$EXPORT_DST_BASE_PATH" ]; then
    echo -e "$FAILED_PREFIX \"$EXPORT_DST_BASE_PATH\" already exists, exits for preventing from unexpected operations."
    exit 1
fi

# Create dist directory
mkdir -p "$EXPORT_DST_BASE_PATH"
printf "%s" "$MANIFESTS_REGISTRY_NAME/$MANIFESTS_LIBRARY_NAME/$MANIFESTS_MODEL_NAME:$MANIFESTS_PARAMS_NAME" >"$EXPORT_DST_BASE_PATH/source.txt"

# Read manifests and handle them
while IFS= read -r layer; do
    BLOB_FILE_NAME="${layer/:/-}"
    BLOB_FILE_PATH="$BLOBS_FILE_BASE_PATH/$BLOB_FILE_NAME"
    BLOB_TYPE_NAME=$(jq -r --arg layer "$layer" '.layers[] | select(.digest == $layer) | .mediaType' "$MANIFESTS_FILE_PATH" | sed 's|.*\.ollama\.image\.\(.*\)|\1|')

    EXPORT_MODEL_FILE_PATH="$EXPORT_DST_BASE_PATH/Modelfile"
    EXPORT_MODEL_BIN_PATH="$EXPORT_DST_BASE_PATH/model.bin"

    case "$BLOB_TYPE_NAME" in
    model)
        cp "$BLOB_FILE_PATH" "$EXPORT_MODEL_BIN_PATH"
        printf "%s\n" "FROM ./model.bin" >>"$EXPORT_MODEL_FILE_PATH"
        ;;
    params)
        PARAMS_JSON="$(cat "$BLOB_FILE_PATH")"
        printf "%s" "$(jq -r 'keys[] as $key | .[$key][] | "PARAMETER \($key) \"\(.)\"" ' <<<"$PARAMS_JSON")" >>"$EXPORT_MODEL_FILE_PATH"
        ;;
    *)
        TYPE_NAME="$(echo "$BLOB_TYPE_NAME" | tr '[:lower:]' '[:upper:]')"
        FILE_CONTENT="$(cat "$BLOB_FILE_PATH")"
        printf "%s\n" "$TYPE_NAME \"\"\"$FILE_CONTENT\"\"\"" >>"$EXPORT_MODEL_FILE_PATH"
        ;;
    esac
done < <(jq -r '.layers[].digest' "${MANIFESTS_FILE_PATH}")

# Echo success message
echo -e "$SUCCESS_PREFIX Model \"$MODEL_FULL_NAME\" has been exported to \"$EXPORT_DST_BASE_PATH\"!"
